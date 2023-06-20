const { Router } = require('express');
const router = Router();
const tokenValidator = require('../validator/jwt/tokenValidator');
const groupController = require('../controllers/groupController');

// GET
// [ 전체 팀 그룹 조회 ]
router.get('/', tokenValidator, groupController.getAllGroups);

// [ 단일 팀 조회 ]
router.get('/:groupId', tokenValidator, groupController.getOneGroup);

// [ 리더 정보 조회 ]
router.get('/:groupId/leader', tokenValidator, groupController.getGroupLeader);

// POST
// [ 팀 등록 ]
router.post('/', tokenValidator, groupController.addGroup);

// [ 팀 신청 ]
router.post('/:groupId', tokenValidator, groupController.userApplicantGroup);

// PATCH
// [ 팀 정보 수정 ]
router.patch('/:groupId/info', tokenValidator, groupController.updateMyGroup);

// [ 팀 수락 ]
router.patch(
  '/:groupId/accept',
  tokenValidator,
  groupController.leaderApplicantAccept
);

//[ 팀 거절 ]
router.patch(
  '/:groupId/reject',
  tokenValidator,
  groupController.leaderApplicantReject
);

// DELETE
// [ 팀 삭제 ]
router.delete('/:groupId', tokenValidator, groupController.deleteGroup);

module.exports = router;
