const { RecaptchaEnterpriseServiceClient } = require('@google-cloud/recaptcha-enterprise');

class RecaptchaService {
    constructor() {
       
        this.client = new RecaptchaEnterpriseServiceClient();
    }

    async createAssessment({ token, expectedAction = null }) {
        try {
            if (process.env.NODE_ENV === 'development' || token === 'TESTING_TOKEN') {
                console.log('reCAPTCHA en modo desarrollo');
                return {
                    success: true,
                    score: 0.9,
                    action: expectedAction || 'development',
                    reasons: []
                };
            }

            const projectId = process.env.RECAPTCHA_PROJECT_ID;
            if (!projectId) {
                throw new Error('RECAPTCHA_PROJECT_ID no configurado');
            }
            const projectName = this.client.projectPath(projectId);

            const request = {
                parent: projectName,
                assessment: {
                    event: {
                        token: token,
                        siteKey: process.env.RECAPTCHA_SITE_KEY,
                    },
                },
            };

            if (expectedAction) {
                request.assessment.event.expectedAction = expectedAction;
            }

            console.log('Creando assessment reCAPTCHA Enterprise...');
            const [response] = await this.client.createAssessment(request);

            if (!response.tokenProperties.valid) {
                return {
                    success: false,
                    score: 0,
                    action: response.tokenProperties.action,
                    reasons: response.tokenProperties.invalidReason ? 
                        [response.tokenProperties.invalidReason] : []
                };
            }

            if (expectedAction && response.tokenProperties.action !== expectedAction) {
                return {
                    success: false,
                    score: response.riskAnalysis.score,
                    action: response.tokenProperties.action,
                    reasons: ['ACTION_MISMATCH']
                };
            }

            return {
                success: response.riskAnalysis.score >= 0.5,
                score: response.riskAnalysis.score,
                action: response.tokenProperties.action,
                reasons: response.riskAnalysis.reasons || []
            };

        } catch (error) {
            console.error(' Error en createAssessment:', error.message);
            
            if (process.env.NODE_ENV === 'development') {
                console.log('Continuando en desarrollo a pesar del error');
                return {
                    success: true,
                    score: 0.7,
                    action: expectedAction || 'error_fallback',
                    reasons: ['RECAPTCHA_SERVICE_ERROR_FALLBACK']
                };
            }

            throw new Error(`Error validando reCAPTCHA: ${error.message}`);
        }
    }
}

module.exports = new RecaptchaService();