const loginForm = document.querySelector("#login-form");
const registerForm = document.querySelector("#register-form");
const userInfoTags = document.querySelectorAll(".card-body>[data-userinfo]");
const navbarBtns = document.querySelectorAll(".navbar-nav>.btn");
const logoutBtn = document.querySelector(".navbar-nav>.btn-logout");


loginForm.addEventListener("submit", (e) => loginUser(e, loginForm))
registerForm.addEventListener("submit", (e) => registerUser(e, registerForm))
logoutBtn.addEventListener("click", userLogout)
displayActiveUser()


function switchBtnsNavbar() {
    navbarBtns.forEach(eachBtn => {
        eachBtn.classList.toggle("d-none")
    })
}

function saveCurrentUser(currentUserData) {
    let currentUser = JSON.stringify(currentUserData)
    localStorage.setItem("currentUser", currentUser)
}

function displayActiveUser() {
    let lastActiveUser = JSON.parse(localStorage.getItem("currentUser"))
    if (lastActiveUser) {
        displayDataPage(userInfoTags, lastActiveUser)
    }
}

function userLogout() {
    switchBtnsNavbar()
    localStorage.removeItem("currentUser")
    location.reload()
}


function loginUser(defaultE, loginFormData) {
    defaultE.preventDefault()
    let usersData = createLocalStorage()
    let userLoginData = packUserLoginData(loginFormData)
    let currentUserData = userVerification(usersData, userLoginData)
    displayDataPage(userInfoTags, currentUserData)
}

function packUserLoginData(loginFormData) {
    const data = new FormData(loginFormData)
    const userLoginData = {
        email: data.get("email").toLocaleLowerCase(),
        password: data.get("password")
    }
    return userLoginData
}

function userVerification(usersData, userLoginData) {
    let currentUserData = 0
    usersData.map(eachUser => {
        if (eachUser.email == userLoginData.email && eachUser.password == userLoginData.password) {
            currentUserData = eachUser
        }
    })
    return currentUserData
}

function displayDataPage(userInfoTags, currentUserData) {
    if (currentUserData != 0) {
        userInfoTags.forEach(eachTag => {
            let datasetVal = eachTag.dataset.userinfo
            if (datasetVal != "-") {
                eachTag.lastChild.textContent = currentUserData[datasetVal]
            }
            eachTag.classList.toggle("d-none")
        })
        saveCurrentUser(currentUserData)
        switchBtnsNavbar()
    }
}


function registerUser(defaultE, registerFormData) {
    defaultE.preventDefault()
    let usersData = createLocalStorage()
    let currentUserData = packUserRegistrationData(registerFormData)
    addUserLocalStorage(usersData, currentUserData)
}

function packUserRegistrationData(registerFormData) {
    const data = new FormData(registerFormData)
    const currentUserData = {
        fullName: `${data.get("name")} ${data.get("last-name")}`,
        email: data.get("email").toLocaleLowerCase(),
        password: data.get("password"),
        city: data.get("city"),
        birthdate: data.get("birthdate")
    }
    return currentUserData
}

function addUserLocalStorage(usersData, currentUserData) {
    usersData.push(currentUserData)
    let updatedListUsersData = JSON.stringify(usersData)
    localStorage.setItem("usersData", updatedListUsersData)
}


function createLocalStorage() {
    let usersData = []
    if (localStorage.getItem("usersData")) {
        let latestUsersData = localStorage.getItem("usersData")
        usersData = JSON.parse(latestUsersData)
    } else {
        localStorage.setItem("usersData", [])
    }
    return usersData
}
