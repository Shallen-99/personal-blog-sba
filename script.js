const storageKey = "blogPosts"
const titleInput = document.getElementById("title")
const contentInput = document.getElementById("content")
const form = document.getElementById("postForm")
const titleError = document.getElementById("titleError")
const contentError = document.getElementById("contentError")
const editingIdInput = document.getElementById("editingId")
const submitBtn = document.getElementById("submitBtn")
const cancelEditBtn = document.getElementById("cancelEditBtn")
const postsContainer = document.getElementById("postsContainer")
const emptyState = document.getElementById("emptyState")
const status = document.getElementById("status")

let posts = []

function savePosts() {
    localStorage.setItem(storageKey, JSON.stringify(posts))
}

function loadPosts() {
    const stored = localStorage.getItem(storageKey)
    return stored ? JSON.parse(stored) : []
}

function generateId() {
    return Date.now().toString(36) + "-" + Math.floor(Math.random() * 10000).toString(36)
}

function clearErrors() {
    titleError.textContent = ""
    contentError.textContent = ""
}

function clearForm() {
    form.reset()
    editingIdInput.value = ""
    submitBtn.textContent = "Submit"
    cancelEditBtn.classList.add("hidden")
    clearErrors()
}

// function clearErrors() {
//     titleError.textContent = ""
//     contentError.textContent = ""
// }

function renderPosts() {
    postsContainer.innerHTML = ""

    if(posts.length === 0) {
        emptyState.style.display = "block"
        return
    } else {
        emptyState.style.display = "none"
    }

    posts.slice().reverse().forEach(post => {
    const wrap = document.createElement("div")
    wrap.className = "post"
    wrap.dataset.id = post.id

    wrap.innerHTML = `
      <h3>${post.title}</h3>
      <p>${post.content}</p>
      <small>Created: ${post.timestamp}</small>
      <div class="actions">
        <button class="edit" data-action="edit" data-id="${post.id}">Edit</button>
        <button class="delete" data-action="delete" data-id="${post.id}">Delete</button>
      </div>
    `

    postsContainer.appendChild(wrap);
  })
}

function validateForm () {
    let valid = true
    clearErrors()

    if (!titleInput.value.trim()) {
        titleError.textContent = "Title is required."
        valid = false
    } else if (titleInput.value.trim().length < 3) {
        titleError.textContent = "Title must be at least 3 characters."
        valid = false
    }

    if (!contentInput.value.trim()) {
        contentError.textContent = "Content is required."
        valid = false
    } else if (contentInput.value.trim().length < 10) {
        contentError.textContent = "Content must be at least 10 characters."
        valid = false
    }
    return valid
}

form.addEventListener("submit", (e) => {
    e.preventDefault()
    if (!validateForm()) return

    const editing = editingIdInput.value
    const title = titleInput.value.trim()
    const content = contentInput.value.trim()
    const timestamp = new Date().toLocaleString()

    if (editing) {
        const i = posts.findIndex(p => p.id === editing)
        if (i !== -1) {
            posts[i].title = title
            posts[i].content = content
            posts[i].timestamp = timestamp
        }
    } else {
        posts.push({
            id: generateId(),
            title: title,
            content: content,
            timestamp
    })
    }

    savePosts()
    renderPosts()
    clearForm()
})

cancelEditBtn.addEventListener("click", clearForm)

postsContainer.addEventListener("click", (e) => {
    const btn = e.target.closest("button")
    if (!btn) return

    const action = btn.dataset.action
    const id = btn.dataset.id

    if (action === "edit") {
        const post = posts.find(p => p.id === id)
        if (!post) return
        titleInput.value = post.title
        contentInput.value = post.content
        editingIdInput.value = post.id
        submitBtn.textContent = "Update Post"
        cancelEditBtn.classList.remove("hidden")
    }

    if (action === "delete") {
        if(!confirm("Are you sure you want to delete this post?"))
            return
        posts = posts.filter(p => p.id !== id)
        savePosts()
        renderPosts()

        if (posts.length === 0) emptyState.style.display = "block";
    }
})

titleInput.addEventListener("input", () => {titleError.textContent = ""})
contentInput.addEventListener("input", () =>{contentError.textContent = ""})

function init() {
    posts = loadPosts()
    renderPosts()
}

init()