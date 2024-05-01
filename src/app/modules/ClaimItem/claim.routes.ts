import express from 'express';

import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import ClaimControllers from './claim.controller';
import ClaimValidations from './claim.validation';
const router = express.Router();

router.post('/claims', auth(), validateRequest(ClaimValidations.createClaimSchema), ClaimControllers.claimItem);
router.get('/claims', auth(), ClaimControllers.getClaims);
router.patch(
	'/claims/:claimId',
	auth(),
	validateRequest(ClaimValidations.updateClaimSchema),
	ClaimControllers.updateStatus
);

const ClaimRoutes = router;
export default ClaimRoutes;