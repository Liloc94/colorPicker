// 게임 상태 관리를 위해 필요한 변수 초기화
let stage = 1; // 게임 스테이지
let time = 15; // 남은 시간
let paletteRow = 2; // 팔레트 행
let paletteSize = paletteRow ** 2; // 팔레트 아이템 전체 갯수 (행의 제곱)
let targetIndex = 0;
let targetOpacity = 0.4; // 타겟 아이템 opacity --> 다른 버튼과 구별용 --> 플레이어 확인용
let color = {}; // 팔레트 아이템 색상 (red, green, blue 값을 저장하는 object)

let timer = 0; // 타이머

// 게임 시작
const modal = document.getElementsByClassName("modal")[0]; // ---------------------------------- 1

function startGame() {
  createPalette(); // ---------------------------------- 2 - to line 38

  timer = setInterval(() => {
    playerTime.innerHTML = --time;

    // 시간 초과
    if (time <= 0) {
      playerTime.innerHTML = 0;

      // 타이머 종료
      clearInterval(timer);

      // 결과메세지 출력
      showGameResult();

      // 게임 설정 값 초기화
      initGame();
    }
  }, 1000);
}

// 팔레트 아이템 생성
function createPalette() {
  // 랜덤으로 타겟 아이템 생성
  targetIndex = createTargetItem(paletteSize); // ---------------------------------- 3 - to line 46
  // 팔레트 아이템 세팅
  settingPlatteItem(); // ---------------------------------- 5 - to line 54
}

// 타겟 생성
function createTargetItem(paletteSize) {
  return Math.floor(Math.random() * paletteSize); // ---------------------------------- 4 - to line 38
}

// 팔레트 아이템 세팅
const palette = document.getElementsByClassName("palette")[0];
const paletteItem = document.getElementsByClassName("palette-item");

function settingPlatteItem() {
  // ---------------------------------- 6 - to line
  // html 추가
  for (let i = 0; i < paletteSize; i++) {
    if (i === targetIndex) {
      palette.innerHTML =
        palette.innerHTML +
        `
                <div class="palette-item" id="target"></div>
            `; // 정답 아이템
    } else {
      palette.innerHTML =
        palette.innerHTML +
        `
                <div class="palette-item"></div> 
            `; // 기본 아이템
    }
  }

  // 아이템 크기 세팅
  let itemSize = 100 / paletteRow;

  // 랜덤 색상 생성
  color = createColor(color); // ---------------------------------- 7 - to line 98

  // 아이템 크기, 색상 적용
  for (let i = 0; i < paletteItem.length; i++) {
    // 크기 적용
    paletteItem[i].style.width = `${itemSize}%`; // ( 100 / 팔레트길이 )로 점점 작아지게
    paletteItem[i].style.height = `${itemSize}%`; // 위와 동일

    // 색상 적용
    let opacity = 1;

    if (paletteItem[i].id === "target") {
      opacity = targetOpacity;
    }

    paletteItem[
      i
    ].style.backgroundColor = `rgba(${color.red}, ${color.green}, ${color.blue}, ${opacity}`;
  }
}

// 랜덤 색상 생성함수
function createColor(color) {
  // ------------------------------------------------------------------- 10 - to line 80
  // 100 ~ 200 초과하면 너무 어둡거나 너무 밝음
  color.red = Math.floor(Math.random() * 101) + 100;
  color.green = Math.floor(Math.random() * 101) + 100;
  color.blue = Math.floor(Math.random() * 101) + 100;

  return color;
}

// 아이템 클릭 이벤트
palette.addEventListener("click", function (e) {
  if (e.target.className === "palette-item") {
    if (e.target.id === "target") {
      selectTargetItem();
    } else {
      selectWrongItem();
    }
  }
});

// 정답 처리
function selectTargetItem() {
  updateSettings();
  createPalette();
}

// 사용자가 정답을 맞춘 경우 설정 값 변경
function updateSettings() {
  // 화면 초기화
  palette.innerHTML = "";

  // targetIndex, color는 팔레트 아이템 생성 시 랜덤 값으로 재생성
  stage++;
  time = 15;

  // stage가 2씩 올라갈 때마다 라인증설
  if (stage % 2 === 1) {
    paletteRow++;
    paletteSize = paletteRow ** 2;
  }

  // opacity 0.02씩 증가(최대 0.94 까지)
  if (targetOpacity <= 0.92) {
    // 소수점 늘어나서 오차방지용 반올림
    targetOpacity = +(targetOpacity + 0.02).toFixed(2);
  }

  // 화면 갱신
  playerTime.innerHTML = time;
  playerStage.innerHTML = stage;
}

// 오답 처리
function selectWrongItem() {
  // 마이너스 값 방지용 0 대입
  if (time - 3 < 0) {
    time = 0;
  } else {
    time = time - 3;
  }

  // 오답 고를 시 진동효과
  palette.classList.add("vibration");

  setTimeout(function () {
    palette.classList.remove("vibration");
  }, 400);

  // 화면 갱신
  playerTime.innerHTML = time;
}

// 게임 초기값으로 변경하는 함수
function initGame() {
  stage = 1;
  time = 15;
  paletteRow = 2;
  paletteSize = paletteRow ** 2;
  targetIndex = 0;
  targetOpacity = 0.4;
  color = {};
}

// 게임 종료 시 출력 문구
function showGameResult() {
  let resultText = "";

  if (stage > 0 && stage <= 5) {
    resultText = "눈에 문제 있는듯!";
  } else if (stage > 5 && stage <= 10) {
    resultText = "리트 ㄱㄱ?";
  } else if (stage > 10 && stage <= 15) {
    resultText = "색깔 찾기 쫌 치네 ~";
  } else if (stage > 15 && stage <= 20) {
    resultText = "최소 몽골족";
  } else if (stage > 20 && stage <= 25) {
    resultText = "인간 채도판별기<br/>지렸다~!";
  } else if (stage > 26 && stage <= 30) {
    resultText = "이게 절대색감인가<br/>뭔가 그거냐?";
  } else if (stage > 30) {
    resultText = "이건 콘솔 안보고 절대 못깸.. 콘솔봤지??";
  }

  modalTitle.innerHTML = `
    <h1 class="modal__content-title--result color-red">
        게임 종료!
    </h1>
    <span class="modal__content-title--stage">
        기록 : <strong>STAGE ${stage}</strong>
    </span>
    <p class="modal__content-title--desc">
        ${resultText}
    </p>
    `;

  modal.classList.add("show");
}

// 모달 창 닫기
const modalTitle = document.getElementsByClassName("modal__content-title")[0];
const modalCloseButton = document.getElementsByClassName(
  "modal__content-close-button"
)[0];

modal.addEventListener("click", function (e) {
  if (e.target === modal || e.target === modalCloseButton) {
    modal.classList.remove("show");

    // 모달창 닫으면 화면 초기화 후 게임 재시작
    palette.innerHTML = "";
    playerTime.innerHTML = time;
    playerStage.innerHTML = stage;

    startGame();
  }
});

// 기본 값 세팅 및 다른 색깔 찾기 게임 자동 시작
const playerTime = document.getElementById("player-time");
const playerStage = document.getElementById("player-stage");

window.onload = function () {
  playerTime.innerHTML = time;
  playerStage.innerHTML = stage;

  startGame();
};
