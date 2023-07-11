const main = document.getElementById('main-content')
const input = document.querySelector('.search-input')
const button = document.querySelector('.search-button')

button.addEventListener('click', (e) => {
    e.preventDefault();
    const username = input.value.trim()
    getGitHubUser(username)
    username ? getGitHubUser(username) : alert("Digite uma usuária válida")
    input.value = ""
})

async function getGitHubUser(username) {
    try {
        const response = await fetch(`https://api.github.com/users/${username}`)
        const userData = await response.json()
        if (response.status == 404) {
            renderUserNotFound()
        } else {
            renderUserCard(userData)
        }
    }
    catch (err) {
        console.error("Capturei um erro: ", err)
    }
}

function renderUserCard(user) {
    const { avatar_url, name, login, bio, followers, public_repos, html_url } = user
    main.innerHTML = `
        <div class="card">
        <a href=${html_url} target="_blank"><img class="profile-img" src=${avatar_url} alt="Foto da usuária do GitHub"></a>
            <h2 class="profile-title">${name}</h2>
            <h4 class="profile-subtitle">${login}</h4>
            <p class="profile-description">${bio}</p>
            <div class="profile-infos">
                <div class="box-icons">
                    <img src='./assets/people_outline.png' class="box-icon">
                    <p class="box-text">${followers}</p>
                    </div>
                    <div id="repo-button" class="box-icons">
                    <img src="./assets/Vector.png" class="box-img">
                    <p class="box-text">${public_repos}</p>        
                </div>
            </div>
        </div>
    `

    const repoButton = document.getElementById('repo-button')
    repoButton.addEventListener('click', clickLink = (e) => {
        e.preventDefault();
        getRepositories(login)
        repoButton.removeEventListener('click', clickLink)

    })
}

function renderUserNotFound() {
    main.innerHTML = `
        <div class='not-found-box'>
            <h1 class='not-found-title'>404 - Usuária não encontrada</h1>
            <h3 clss='not-found-subtitle'>Pesquise novamente😕</h3>
            <img class='not-found-img' src='./assets/notfound.png'>
        </div>
    `
}


async function getRepositories(username) {
    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos`)
        const repositories = await response.json()

        if (repositories.length === 0) {
            renderRepositoriesNotFound(username)
        } else {
            renderRepositoriesCards(repositories)
        }
    }
    catch (err) {
        console.error("Capturei um erro: ", err)
    }

}

function renderRepositoriesCards(repositories) {
    const repositoriesList = document.createElement('div')
    repositoriesList.setAttribute('id', 'repositories-list')
    main.appendChild(repositoriesList)

    repositories.map((repository) => {
        const { name, description, language, stargazers_count } = repository
        return repositoriesList.innerHTML += `
            <div class="repository">
                <h2 class="repository-title">${name}</h2>
                <p class="repository-description">${description ? description : "Not Description"}</p>
                <div class="repository-details">
                    <p class="repository-text">${language ? language : "Not Language"}</p>
                    <p class="repository-text">
                        <img src="./assets/star.png" class="icon">
                        ${stargazers_count}</p>
                <div>
            </div>
        `
    })
}

function renderRepositoriesNotFound(username) {
    main.innerHTML += `
    <div class="not-repository">
    <h1 class="not-repository-title"> ${username} não possui repositórios públicos.</h1>
    </div>
    
    `
}