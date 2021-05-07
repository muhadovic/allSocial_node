import { check, validate, isMongoId } from '../../utils/validation/index';

export default [
    check('type').custom((value) => {
        if (value !== 'reaction' && value !== 'childReaction')
            throw new Error('type can only be reaction or childReaction');
        return true;
    }),
    check('option').custom((option) => isMongoId(option.feedId)),
    check('kind'),
    check('activity'),
    check('data').optional(),
    validate,
];
