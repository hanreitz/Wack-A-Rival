const mascotImages = document.querySelector("template#mascot-images").content.children;
let previousMascotBottom, previousMascotLeft
let scoreboard = 0;

function getRandomMascot() {
  randomMascot = mascotImages[Math.floor(Math.random()*mascotImages.length)].cloneNode(true);
  mascotDiv = document.createElement("div")
  mascotDiv.innerHTML = `
    <img src="wack-a-mole-images/dirt-pile.png" width="175" class="relative z-10">
  `

  assignMascotTopAndBottom();

  mascotDiv.className = `absolute`

  document.querySelector("#mascots-div").appendChild(mascotDiv)
  randomMascot.className = "mascot absolute bottom-10 z-0 left-10 transition duration-200"
  mascotDiv.appendChild(randomMascot)
}

function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function translateMascotUp(mascot, div) {
  mascot.style.transform = "translateY(-105px)";

  mascot.addEventListener("transitionend", function() {
    let randomTime = randomInteger(300, 900)

    setTimeout(function() {
      div.remove();
      peep(mascot);
    }, randomTime)
  })
}

function assignMascotTopAndBottom() {
  // check if mascot bottom value is too close to the previous value. We don't want them popping up right next to each other
  let mascotBottom = randomInteger(0, 40)

  while (Math.abs(mascotBottom - previousMascotBottom) < 10) {
    mascotBottom = randomInteger(0, 40)
  }

  mascotDiv.style.bottom = mascotBottom + "%";
  previousMascotBottom = mascotBottom

  // check the same way for mascot left value
  let mascotLeft = randomInteger(0, 75)

  while (Math.abs(mascotLeft- previousMascotLeft) < 20 ) {
    mascotLeft = randomInteger(0, 75)
  }

  mascotDiv.style.left = mascotLeft + "%";
  previousMascotLeft = mascotLeft
}

function peep(mascot) {
  appendMascotandMascotDiv(mascot);
  // mascot.addEventListener("load", function() {
  //   mascot.addEventListener("click", function() {
  //     updateScoreboard()
  //   })
  //   translateMascotUp(mascot, mascotDiv);
  // })
}

function appendMascotandMascotDiv(mascot) {
  mascotDiv = document.createElement("div")
  mascotDiv.innerHTML = `
    <img src="wack-a-mole-images/dirt-pile.png" width="175" class="relative z-10">
  `

  assignMascotTopAndBottom();

  mascotDiv.className = `absolute`

  document.querySelector("#mascots-div").appendChild(mascotDiv)
  mascot.className = "mascot absolute bottom-10 z-0 left-10 transition duration-200"
  mascotDiv.appendChild(mascot)

  mascot.addEventListener("load", function() {
    mascot.addEventListener("click", function() {
      updateScoreboard()
    })
    translateMascotUp(mascot, mascotDiv);
  })
}

function updateScoreboard() {
  scoreboard += 1
  displayScore();
}

function displayScore() {
  let score = document.querySelector("div#scoreboard").querySelector("span");
  score.innerText = scoreboard;
}

function countDownToStartGame() {
  const scoreboard = document.querySelector("div#scoreboard");
  const gameScreen = document.querySelector("div#game-screen");
  gameScreen.classList.remove("hidden")

  scoreboard.insertAdjacentElement("beforeEnd", createCountDownClockElement(5));
  const countDownClock = document.querySelector("div#countdown-clock")
  const numberDiv = countDownClock.querySelector("div#number-div")

  window.scrollTo({
    top: gameScreen.scrollHeight,
    left: 0,
    behavior: 'smooth'
  });

  numberDiv.addEventListener("load", startCountDownClock(numberDiv))
}

function startGame(gameLength) {
  document.querySelector("div#scoreboard").insertAdjacentElement("beforeEnd", createCountDownClockElement(gameLength));

  const gameClock = document.querySelector("div#countdown-clock")
  const numberDiv = gameClock.querySelector("div#number-div");
  startGameClock(numberDiv, gameLength);
}

function startCountDownClock(numberDiv) {
  let countDownTimer = numberDiv.innerText

  const countDownVar = setInterval(() => {
    console.log(countDownTimer)

    countDownTimer -- 
    numberDiv.style.transform = "translateX(35px)"

    numberDiv.addEventListener("transitionend", function() {
      
      numberDiv.innerText = countDownTimer
      numberDiv.style.transform = ""
    })

    if (parseInt(countDownTimer) === 0) {
      clearInterval(countDownVar);
      document.querySelector("div#countdown-clock").remove()
      startGame(10);
    } 
  }, 1000)
}

function createCountDownClockElement(initialValue) {
  const countDownClock = document.createElement("div")

  countDownClock.id = "countdown-clock"
  countDownClock.className = "inline-block w-full absolute bottom-1/4"
  countDownClock.innerHTML = `
    <div class="w-6 overflow-hidden mx-auto">
      <div id="number-div" class="transition duration-200">${initialValue}</div>
    </div>
  `
  return countDownClock;
}

function startGameClock(numberDiv, gameLength) {
  const peepMascot = document.querySelector("img.mascot-image").cloneNode(true);
  peepMascot.style.width ="90px"

  peep(peepMascot);

  let gameClock = numberDiv.innerText

  const gameClockVar = setInterval(() => {
    console.log(gameClock)
  
    gameClock -- 

    numberDiv.style.transform = "translateX(35px)"

    numberDiv.addEventListener("transitionend", function() {
      numberDiv.innerText = gameClock
      numberDiv.style.transform = ""
    })

    if (gameClock == 0) {
      document.querySelector("div#countdown-clock").remove()
      clearInterval(gameClockVar);
    } 
  }, 1000)
}

function stopPeep() {
  alert("game Over!")
}

window.addEventListener("DOMContentLoaded", () => {
  mascotScroll();
})

function mascotScroll() {
  fetch("http://localhost:3000/teams")
  .then(resp => resp.json())
  .then(json => displayMascotCarosel(json))
}

function displayMascotCarosel(json) {
  mascotObjects = json.included
  teamObjects = json.data
  
  mascotImagesArray = mascotObjects.map( mascotObject => { return createMascotElement(mascotObject) })

  const MascotSelectionDiv = document.querySelector("div#mascot-selection");

  MascotSelectionDiv.innerHTML = `
  <div id="image-counter" class="absolute top-0 left-0"></div>
  <div id="current-mascot" class="relative transition duration-500 cursor-pointer flex w-full h-5/6 items-center justify-center text-center">
  
  </div>
  <a id="previous" class="cursor-pointer absolute top-1/2 p-4 w-auto left-0 text-2xl">&#10094;</a>
  <a id="next" class="cursor-pointer absolute top-1/2 p-4 w-auto right-0 text-2xl">&#10095;</a>
  `

  let currentMascotImage = mascotImagesArray[0];

  const schoolNameDiv = document.createElement("div");
  schoolNameDiv.id = "mascot-description"
  schoolNameDiv.innerText = `${mascotObjects[0].attributes.name}`
  schoolNameDiv.className = "font-bold"

  MascotSelectionDiv.insertAdjacentElement("afterbegin", schoolNameDiv);

  document.querySelector("div#current-mascot").insertAdjacentElement("beforeend", currentMascotImage)
  transitionMascotAndListenForClick();
  document.querySelector("div#image-counter").innerText = `${mascotImagesArray.indexOf(currentMascotImage) + 1}/${mascotImagesArray.length}`

  currentMascotImage.addEventListener("load", function() {
    const next = document.querySelector("a#next")
    const previous = document.querySelector("a#previous")

    next.addEventListener("click", function() {
      showNextMascot(event)
    })
    previous.addEventListener("click", function() {
      showPreviousMascot(event)
    })
  })
}

function showNextMascot(e) {
  removeTeamDetails();
  hideGameScreen();
  const currentMascot = e.target.parentElement.querySelector("img");
  const mascotId = parseInt(currentMascot.dataset.mascotId)

  if (mascotId === mascotImagesArray.length) {
    document.querySelector("img.mascot-image").remove();
    document.querySelector("div#current-mascot").insertAdjacentElement("beforeend", mascotImagesArray[0])
    transitionMascotAndListenForClick() 
    document.querySelector("div#image-counter").innerText = `1/${mascotImagesArray.length}`
    document.querySelector("div#mascot-description").innerText = `${mascotObjects[0].attributes.name}`
  } else {
    // remove current mascot image
    document.querySelector("img.mascot-image").remove();
    // add next mascot image to carosel
    document.querySelector("div#current-mascot").insertAdjacentElement("beforeend", mascotImagesArray[parseInt(mascotImagesArray.indexOf(currentMascot) + 1)]) 
    transitionMascotAndListenForClick();
    document.querySelector("div#image-counter").innerText = `${mascotImagesArray.indexOf(currentMascot) + 2}/${mascotImagesArray.length}`
    document.querySelector("div#mascot-description").innerText = `${mascotObjects[mascotImagesArray.indexOf(currentMascot) + 1].attributes.name}`
  }
}

function showPreviousMascot(e) {
  const currentMascot = e.target.parentElement.querySelector("img");
  const mascotId = parseInt(currentMascot.dataset.mascotId)

  if (mascotId === 1) {
    document.querySelector("img.mascot-image").remove();
    document.querySelector("div#current-mascot").insertAdjacentElement("beforeend", mascotImagesArray[mascotImagesArray.length - 1]) 
    document.querySelector("div#image-counter").innerText = `${mascotImagesArray.length}/${mascotImagesArray.length}`
  } else {
    // remove current mascot image
    currentMascot.remove();
    // add next mascot image to carosel
    document.querySelector("div#current-mascot").insertAdjacentElement("beforeend", mascotImagesArray[parseInt(mascotId) - 1]) 
    document.querySelector("div#image-counter").innerText = `${mascotId-1}/${mascotImagesArray.length}`
  }
}

function createMascotElement(mascotObject) {
  const image = document.createElement("img");
  image.src = mascotObject.attributes.cartoon_image_location
  image.setAttribute("width", "120px")
  image.setAttribute("data-mascot-id", mascotObject.id)
  image.className = "mascot-image text-center"

  return image
}

function transitionMascotAndListenForClick() {
  document.querySelector("div#current-mascot").addEventListener("mouseenter", e => {
    e.target.style.transform = "translateY(-20px)"
  })
  document.querySelector("div#current-mascot").addEventListener("mouseleave", e => {
    e.target.style.transform = ""
  })
  document.querySelector("div#current-mascot").addEventListener("click", e => {
    showTeamAndMascotDetails(e)
  })
}

function showTeamAndMascotDetails(e) {
  // remove teamDetails if they exist
  removeTeamDetails();

  const mascotId = document.querySelector(".mascot-image").dataset.mascotId
  const mascotObject = mascotObjects.find( element => { return element.id === mascotId })
  const teamObject = teamObjects.find( element => { return element.relationships.mascot.data.id === mascotId })
  
  const teamDetailDiv = document.createElement("div")
  teamDetailDiv.id = "team-detail"
  teamDetailDiv.className = "w-full h-3/5"
  teamDetailDiv.innerHTML = `
    <div class="flex flex-col justify-center space-y-2 py-3">
      <h1 class="text-center text-3xl">${teamObject.attributes.school}</h1>
      <h3 class="text-center text-xl">${teamObject.attributes.shorthand_name} ${teamObject.attributes.nickname}</h3>
      <div class="self-center">
        <button class="bg-blue-400 text-white w-48 h-8 border rounded-md">Wack-a-${teamObject.attributes.nickname}</button>
      </div>
    </div>
    <div>
    </div>
  `

  document.querySelector("div#mascot-selection").insertAdjacentElement("afterend", teamDetailDiv)

  teamDetailDiv.querySelector("button").addEventListener("click", () => {
    event.preventDefault();
    countDownToStartGame();
  })
}

// function showMascots() {
//   const mascots = document.querySelector("template#mascot-images").content.children;

//   Array.from(mascots).forEach( mascot => {
//     let mascotClone = mascot.cloneNode(true);
//     mascotClone.className =""
//     mascotClone.style.width = "75px"

//     let mascotDiv = document.createElement("div");
//     mascotDiv.className = "py-12 h-20 mascots transition duration-500 cursor-pointer"
//     mascotDiv.dataset.MascotId = mascotClone.dataset.mascotId

//     mascotDiv.appendChild(mascotClone);

//     document.querySelector("div#mascot-selection").appendChild(mascotDiv);
//   })

//   for (const mascot of document.querySelectorAll(".mascots")) {
//     mascot.addEventListener("mouseenter", e => {
//       e.target.style.transform = "translateY(-30px)"
//     })
//     mascot.addEventListener("mouseleave", e => {
//       e.target.style.transform = ""
//     })
//     mascot.addEventListener("click", e => {
//       showMascotInfo(e.target.dataset.mascotId)
//     })
//   }
// }

  function removeTeamDetails() {
    const teamDetail = document.querySelector("div#team-detail")
    if (teamDetail) {
      teamDetail.remove();
    }
  }

  function hideGameScreen() {
    document.querySelector("div#game-screen").classList.add("hidden");
  }





