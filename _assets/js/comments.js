var commentsLoaded = false;

function printComments(commentList, data) {
    if (data && data.commentList && data.commentList.length) {
        commentList.innerHTML = '<h2>Comments</h2>';
        let dateFormat = new Intl.DateTimeFormat('en-GB', { year: 'numeric', month: 'short', day: '2-digit', hour: 'numeric', minute: 'numeric' });

        for (let comment of data.commentList) {
            let article = document.createElement('article');
            article.classList.add('mt-ryt-lg', 'mb-ryt-xl');
            //author 
            let meta = document.createElement('div');
            let author = document.createElement('span');
            author.classList.add('font-bold', 'text-sm');
            author.innerHTML = comment.author;
            //date posted
            let created = document.createElement('time');
            created.classList.add('text-sm');
            created.innerHTML = dateFormat.format(new Date(comment.createdAt));
            created.setAttribute('datetime', comment.createdAt);
            meta.appendChild(author);
            meta.appendChild(document.createTextNode(' '));
            meta.appendChild(created);
            article.appendChild(meta);
            //comment body
            let body = document.createElement('div');
            body.innerHTML = comment.htmlBody;
            article.appendChild(body);

            commentList.appendChild(article);
        }
    } else {
        commentList.innerHTML = ''
    }
}

async function loadComments(commentList) {
    let indicateLoadFailure = document.querySelector('.comments .indicate-load-failure');
    try {
        if (!commentsLoaded) {
            commentList.innerHTML = '';
            const url = new URL(location.href);
            let response = await fetch('/api/comments/?origUrl=' + url.origin + url.pathname);
            if (response.ok) {
                let data = await response.json();
                commentsLoaded = true;
                if (indicateLoadFailure) {
                    indicateLoadFailure.innerHTML = '';
                }
                printComments(commentList, data);
            } else {
                throw new Error(response.status + ' ' + response.statusText);
            }
        }
    }
    catch (err) {
        commentsLoaded = false;
        if (indicateLoadFailure) {
            indicateLoadFailure.innerHTML = 'There was a failure when loading all comments for this post.<br>Please try again later.';
        }
        console.error(err);
    }
}

function disableForm(form) {
    for (let el of form.elements) {
        el.disabled = true;
    }
}

function enableForm(form) {
    for (let el of form.elements) {
        el.disabled = false;
    }
}

function clearForm(form) {
    form.comment.value = '';
}

function formHandling(commentList) {
    let commentForm = document.querySelector('.comments .comment-form');
    let submitButton = document.querySelector('.comments .submit-comment');
    let indicateSubmitFailure = document.querySelector('.comments .indicate-submit-failure');
    if (commentForm) {
        commentForm.addEventListener('submit', async (event) => {
            try {
                event.preventDefault();
                disableForm(commentForm);
                if (submitButton) {
                    submitButton.value = 'Submitting your comment ...';
                }
                const payload = {
                    author: commentForm.author.value,
                    comment: commentForm.comment.value
                }
                const url = new URL(location.href);
                let response = await fetch('/api/comments/?origUrl=' + url.origin + url.pathname, {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(payload)
                });
                if (response.ok) {
                    if (indicateSubmitFailure) {
                        indicateSubmitFailure.innerHTML = '';
                    }
                    let data = await response.json();
                    printComments(commentList, data);
                    clearForm(commentForm);
                } else {
                    throw new Error(response.status + ' ' + response.statusText);
                }
            } catch (err) {
                commentsLoaded = false;
                if (indicateSubmitFailure) {
                    indicateSubmitFailure.innerHTML = 'There was a failure.<br>Your comment has not been submitted.<br>Please try again later.';
                }
                console.error(err);
            }
            finally {
                if (submitButton) {
                    submitButton.value = 'Submit your comment'
                }
                enableForm(commentForm);
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', event => {
    let commentList = document.querySelector('.comments .comment-list');

    let observer = new IntersectionObserver(async function () {
        await loadComments(commentList);
    });
    observer.observe(commentList);

    let authorName = document.querySelector('.comments input[name=author]');
    if (authorName && localStorage) {
        authorName.value = localStorage.commentAuthorName ? localStorage.commentAuthorName : '';
        authorName.addEventListener('blur', event => {
            localStorage.commentAuthorName = authorName.value;
        })
    }

    formHandling(commentList);

});
