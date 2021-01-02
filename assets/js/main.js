// Fetch YouTube videos.
// Future refactor. Save video to local storage,
// And fetch from there instead.
const fetchYoutubeVideos = () =>
  fetch(
    'https://www.googleapis.com/youtube/v3/search?key=AIzaSyCGxjuEYdoY-8RO6OVJ9RWRDuSkJwPI5to&channelId=UCIYYahj78ZKudTI5HzFhTeg&part=snippet,id&maxResults=50&order=date'
  )
    .then((response) => response.json())
    .then((data) => {
      displayVideos(data.items);

      let searchData = [];
      data.items.map((vid) => searchData.push({ title: vid.snippet.title }));
      // console.log('search', searchData);
      $('.ui.search').search({
        source: searchData,
      });

      document.querySelector('.prompt').addEventListener('input', (e) => {
        e.preventDefault();

        let matches = data.items.filter((video) => {
          let exp = new RegExp(`${e.target.value}`, 'gi');
          return video.snippet.title.match(exp || video.abbr.match(exp));
        });

        document.querySelector('div.ui.link.cards').innerHTML = '';
        displayVideos(matches);
      });
    });

const watchVideo = (videoId) => {
  let meetingID = Math.random().toString(36).substr(2, 12);

  let visit =
    '/watch/' + meetingID + '?url=https://www.youtube.com/watch?v=' + videoId;
  window.open(visit, '_self');
};

const displayVideos = (videos) => {
  videos.map((video) => {
    // Create video card
    let card = document.createElement('div');
    card.classList.add('card');
    card.style.fontFamily = "'Nunito', sans-serif";
    card.innerHTML = `
      <div class='image blurring dimmable'>
        <div class='ui dimmer'>
          <div class='content'>
            <div class='center'>
              <button id='Watch-here' class='ui green basic button'>watch</button>
            </div>
          </div>
        </div>
        <img src=${video.snippet.thumbnails.high.url} />
      </div>
      <div class='content'>
        <div class='header' style="font-family: 'Nunito', sans-serif">${
          video.snippet.title
        }</div>
            <div class='meta'>
              <p>${moment(video.snippet.publishedAt).format('Do MMMM yyyy')}</p>
            </div>
          <div class='description'>
            ${video.snippet.description}
          </div>
        </div>`;

    // Add onclick event
    card.addEventListener('click', () => {
      // watchVideo(video.id.videoId);
      localStorage.setItem('video', JSON.stringify(video));
      window.open('/play', '_self');
    });

    // Display video card
    document.querySelector('div.ui.link.cards').appendChild(card);
    // Set jQuery dimming
    $('.special.cards .image').dimmer({
      on: 'hover',
    });
  });
};

//

// Fetch Youtube videos.
fetchYoutubeVideos();
