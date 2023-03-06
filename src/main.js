const path = '/album/wp-content/uploads/verge3d/digital-editor/build/';
function handleRunApp() {
  // change album
  const albumButtons = document.querySelectorAll('.btn_album');
  if (albumButtons) {
    albumButtons.forEach((ele) => {
      ele.addEventListener('click', () => {
        if (!ele.classList.contains('active')) {
          // remove active class
          albumButtons.forEach((e) => {
            if (e.classList.contains('active')) {
              e.classList.remove('active');
            }
          });
          ele.classList.add('active');
          const id = ele.getAttribute('id');
          v3d.puzzles.procedures.changeAlbum(id);
        }
      });
    });
  }
  // apply text

  window.addEventListener('message', function (e) {
    btnOpen.classList.remove('none');
    btnClose.classList.add('none');
    if (frameCont?.firstChild) {
      frameCont.removeChild(frameCont.firstChild);
    }
    let checkingAlbum;
    albumButtons.forEach((elm) => {
      if (elm.classList.contains('active')) {
        checkingAlbum = elm.getAttribute('id');
      }
    });
    v3d.puzzles.procedures.changeImage(
      URL.createObjectURL(e.data.image),
      checkingAlbum
    );
    v3dCont.classList.remove('none');
  });

  //'/album_player/18360/build/index.html?height=100px&width=886px&obs=3x3&obsTop=20&obsLeft=50';

  const btnOpen = document.querySelector('.btn_open');
  const btnClose = document.querySelector('.btn_close');
  const frameCont = document.getElementById('frame_container');
  const v3dCont = document.getElementById('v3d-container');
  const loading = document.getElementById('loading');
  btnOpen.addEventListener('click', (e) => {
    let checkingAlbum;
    let iframeSrc;
    loading.classList.remove('none');
    setTimeout(() => {
      loading.classList.add('none');
    }, 800);
    albumButtons.forEach((elm) => {
      if (elm.classList.contains('active')) {
        checkingAlbum = elm.getAttribute('id');
      }
    });
    if (checkingAlbum === '30x30') {
      iframeSrc = path + 'index.html?&size=30x30';
    } else {
      iframeSrc = path + 'index.html';
    }

    if (frameCont?.firstChild) {
      frameCont.removeChild(frameCont.firstChild);
    }
    // Create a new iframe element
    let iframeElement = document.createElement('iframe');
    iframeElement.setAttribute('class', 'main_frame active');
    iframeElement.setAttribute('style', 'height: 100vh; width: 100vw');
    iframeElement.setAttribute('src', iframeSrc);
    iframeElement.setAttribute('frameborder', '0');
    //
    v3dCont.classList.add('none');
    // Append the iframe element to the frame_container div element
    frameCont.appendChild(iframeElement);
    btnOpen.classList.add('none');
    btnClose.classList.remove('none');
  });
  // close form
  btnClose.addEventListener('click', (e) => {
    v3dCont.classList.remove('none');
    btnOpen.classList.remove('none');
    btnClose.classList.add('none');
    if (frameCont?.firstChild) {
      frameCont.removeChild(frameCont.firstChild);
    }
  });
}

document.addEventListener('handleRunApp', handleRunApp);
