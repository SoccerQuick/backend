const { WithdrawnUser } = require('../model/models/index');

//[ 6개월마다 탈퇴DB 정리하는 스케줄링 함수 ]
const deleteExpiredWithdrawnUsers = async () => {
  try {
    const sixMonth = new Date();
    sixMonth.setMonth(sixMonth.getMonth() - 6);

    await WithdrawnUser.deleteMany({ withdrawalDate: { $lt: sixMonth } });
  } catch (error) {
    console.error(error);
  }
};

module.exports = deleteExpiredWithdrawnUsers;
