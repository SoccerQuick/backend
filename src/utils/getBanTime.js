const getBanTime = (currentDate, day) => {
  const banDuration = 24 * 60 * 60 * day; // 24시간(1일)을 밀리초로 변환
  const banEndDate = new Date(currentDate.getTime() + banDuration);
  return banEndDate;
};

module.exports = getBanTime;
