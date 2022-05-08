
function flashVideoPlayer(el, settings = {
	infinite: false,
	lockScreen: true
}) {
	
	// elements-and-values
	// el = flashSelector(el);
	const startCon = el.querySelector('.fl-video-player-start');
	const startBtn = el.querySelector('.fl-video-player-start-btn');
	const video = el.querySelector('.fl-video-player-video');
	const title = el.querySelector('.fl-video-player-title');
	const loading = el.querySelector('.fl-loading');
	const paused = el.querySelector('.fl-paused');
	const fullTime = el.querySelector('.fl-video-player-full-time');
	const currentTime = el.querySelector('.fl-video-player-current-time');
	const timeline = el.querySelector('.fl-video-player-timeline');
	const bigButtonsCon = el.querySelector('.fl-video-player-big-buttons');
	const bigPlayBtn = el.querySelector('.fl-video-player-big-play-btn');
	const bigPlayBtnIcon = bigPlayBtn.querySelector('i');
	const playBtn = el.querySelector('.fl-video-player-play-btn');
	const playBtnIcon = playBtn.querySelector('i');
	const forwardBtn = el.querySelector('.fl-video-player-forward-btn');
	const backwardBtn = el.querySelector('.fl-video-player-backward-btn');
	const speedButtons = el.querySelectorAll('.fl-video-player-speed-btn');
	const qualityButtons = el.querySelectorAll('.fl-video-player-quality-btn');
	const selectedQuality = el.querySelector('.fl-video-player-selected-quality');
	const fullScreenBtn = el.querySelector('.fl-video-player-full-screen-btn');
	const exitFullScreenBtn = el.querySelector('.fl-video-player-exit-full-screen-btn');
	const lockScreenBtn = el.querySelector('.fl-video-player-lock-btn');
	const lockScreenBtnIcon = lockScreenBtn.querySelector('i');
	const volumeToggler = el.querySelector('.fl-video-player-volume-btn');
	const volumeIcon = volumeToggler.querySelector('i');
	const volumeSlider = el.querySelector('.fl-video-player-volume-slider');
	const volumeNumber = el.querySelector('.fl-video-player-volume-number');
	const controlbar = el.querySelector('.fl-video-player-controlbar');
	var timelineIsFocused = false;
	var timePosition;
	var lastVolume;
	var myFunction;
	var toggle;

	if (!settings.infinite) settings.infinite = false;
	if (!settings.lockScreen) settings.lockScreen = true;

	// functions
	function changeSpeed() {

		const speed = Number(this.getAttribute('data'));
		video.playbackRate = speed;

		for (var i = 0; i < speedButtons.length; i++) {
			
			if (speedButtons[i] == this) this.classList.add('fl-active');
			else speedButtons[i].classList.remove('fl-active');

		}

	}

	function changeQuality() {

		selectedQuality.innerHTML = this.innerHTML;

		for (var i = 0; i < qualityButtons.length; i++) {
			
			if (qualityButtons[i] == this) this.classList.add('fl-active');
			else qualityButtons[i].classList.remove('fl-active');

		}

	}

	const start = () =>	{ 

		setFullTime();
		video.play();
		isLoading();

		video.addEventListener('playing', loadingProcess);

		bigPlayBtn.addEventListener('click', pause);
		playBtn.addEventListener('click', pause);

		forwardBtn.addEventListener('click', forward);
		backwardBtn.addEventListener('click', backward);

		el.addEventListener('mousemove', showElements);

		toggleElements();

	}

	const play = () => { video.play(); readyToPause(); }

	const pause = () => { video.pause(); readyToPlay(); }

	const readyToPlay = () => {

		bigPlayBtnIcon.classList.remove('fa-pause');
		bigPlayBtnIcon.classList.add('fa-play');
		playBtnIcon.classList.remove('fa-pause');
		playBtnIcon.classList.add('fa-play');

		bigPlayBtn.removeEventListener('click', pause);
		playBtn.removeEventListener('click', pause);
		bigPlayBtn.addEventListener('click', play);
		playBtn.addEventListener('click', play);

	}

	const readyToPause = () => {

		bigPlayBtnIcon.classList.remove('fa-play');
		bigPlayBtnIcon.classList.add('fa-pause');
		playBtnIcon.classList.remove('fa-play');
		playBtnIcon.classList.add('fa-pause');

		bigPlayBtn.removeEventListener('click', play);
		playBtn.removeEventListener('click', play);
		bigPlayBtn.addEventListener('click', pause);
		playBtn.addEventListener('click', pause);

	}

	const videoIsEnded = () => { settings.infinite ? replay() : end(); }

	const end = () => {

		video.pause();
		video.currentTime = 0;

		startCon.classList.remove('fl-hide');

		readyToPause();

	}

	const replay = () => { video.currentTime = 0; video.play(); readyToPause(); }

	const isLoading = () => { loading.classList.remove('fl-hide'); startCon.classList.add('fl-hide'); }

	const isNotLoading = () => { loading.classList.add('fl-hide'); }	

	const loadingProcess = () => { video.readyState >= 3 ? isNotLoading() : isLoading(); }

	const fullScreen = () => {
		
		if (el.requestFullscreen) el.requestFullscreen();
		else if (el.webkitRequestFullscreen)el.webkitRequestFullscreen();
		else if (el.msRequestFullscreen)el.msRequestFullscreen();

		el.classList.add('fl-full-screen');

	}

	const exitFullScreen = () => {

		if (document.exitFullscreen) document.exitFullscreen();
		else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
		else if (document.msExitFullscreen) document.msExitFullscreen(); 

	}

	const removeFullScreenClass = () => {
		
		document.addEventListener('fullscreenchange', exitHandler);
		document.addEventListener('webkitfullscreenchange', exitHandler);
		document.addEventListener('mozfullscreenchange', exitHandler);
		document.addEventListener('MSFullscreenChange', exitHandler);

		function exitHandler() {
		    if (!document.fullscreenElement && !document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement) {
		        el.classList.remove('fl-full-screen');
		    }
		} 

	}

	const lock = () => { 

		lockScreenBtnIcon.classList.add('fa-lock');
		lockScreenBtnIcon.classList.remove('fa-unlock');
		controlbar.classList.remove('fl-show');
		bigButtonsCon.classList.remove('fl-show');
		title.classList.remove('fl-show');

		el.removeEventListener('mousemove', showElements);

		clearTimeout(myFunction);

		el.removeEventListener('click', toggle);

		lockScreenBtn.removeEventListener('click', lock);
		lockScreenBtn.addEventListener('click', unlock);
		lockScreenBtn.classList.add('is-unlock-btn');

	}

		const unlock = () => { 

		lockScreenBtnIcon.classList.remove('fa-lock');
		lockScreenBtnIcon.classList.add('fa-unlock');
		controlbar.classList.add('fl-show');
		bigButtonsCon.classList.add('fl-show');
		title.classList.add('fl-show');

		el.addEventListener('mousemove', showElements);

		el.addEventListener('click', toggle);

		lockScreenBtn.addEventListener('click', lock);
		lockScreenBtn.removeEventListener('click', unlock);
		lockScreenBtn.classList.remove('is-unlock-btn');

	}

	const setFullTime = () => {

			var hr  = Math.floor(video.duration  / 3600);
			var min = Math.floor((video.duration  - (hr * 3600))/60);
			var sec = Math.floor(video.duration  - (hr * 3600) - (min * 60));

			if (hr < 10) hr = '0' + hr;
			if (min < 10) min = '0' + min;
			if (sec < 10) sec = '0' + sec;
			fullTime.innerHTML = hr + ':' + min + ':' + sec;

  	}

  	const setCurrentTime = () => {

  		if (timelineIsFocused) return;

	    var hr  = Math.floor(video.currentTime  / 3600);
	    var min = Math.floor((video.currentTime  - (hr * 3600))/60);
	    var sec = Math.floor(video.currentTime  - (hr * 3600) - (min * 60));

	    if (hr < 10) hr = '0' + hr;
	    if (min < 10) min = '0' + min;
	    if (sec < 10) sec = '0' + sec;

	    currentTime.innerHTML = hr + ':' + min + ':' + sec;

	    timePosition = video.currentTime / video.duration;

	    const val = timePosition * 100;
	    timeline.value = val;

	    const styleTag = document.createElement("style");
		el.append(styleTag);
		styleTag.append('.fl-video-player-timeline::before {width: '+val+'% !important;}');

	    if (video.ended) videoIsEnded();

  	}

  	const changeCurrentTime = () => {

  		if (!timelineIsFocused) return;

  		const pos = video.duration / 100;
  		const time = timeline.value * pos;

  		var hr  = Math.floor(time  / 3600);
	    var min = Math.floor((time  - (hr * 3600))/60);
	    var sec = Math.floor(time  - (hr * 3600) - (min * 60));

	    if (hr < 10) hr = '0' + hr;
	    if (min < 10) min = '0' + min;
	    if (sec < 10) sec = '0' + sec;

	    video.currentTime = time;
	    currentTime.innerHTML = hr + ':' + min + ':' + sec;

	    timePosition = time / video.duration;

	    const val = timePosition * 100;
	    timeline.value = val;

	    const styleTag = document.createElement("style");
		el.append(styleTag);
		styleTag.append('.fl-video-player-timeline::before {width: '+val+'% !important;}');

  	}

  	const forward = () => { 

  		if (video.currentTime <= video.duration - 10) video.currentTime += 10;
  		else video.currentTime = video.duration;

  	}

    const backward = () => { 

    	if (video.currentTime > 9) video.currentTime -= 10; 
    	else video.currentTime = 0;

    }

    const toggleVolume = () => { video.muted ? unmute() : mute(); }

	const mute = () => {

		video.muted = true;
		volumeIcon.classList.add('fa-volume-off');
		volumeIcon.classList.remove('fa-volume-up');
		volumeIcon.classList.remove('fa-volume-down');

		const styleTag = document.createElement("style");
		el.append(styleTag);
		styleTag.append('.fl-video-player-volume-slider::before {width: 0 !important;}');

		lastVolume = volumeSlider.value;
		volumeSlider.value = 0;
		volumeNumber.innerHTML = 0;

	}

	const unmute = () => {

		video.muted = false;
		volumeIcon.classList.remove('fa-volume-off');

		volumeSlider.value = lastVolume;
		const val = volumeSlider.value;
	    video.volume =  val / 100;
	    volumeNumber.innerHTML = val;

	    const maxVal = volumeSlider.getAttribute('max');
		const newVal = volumeSlider.value / maxVal;
		const width = newVal * 100 + "%";

	    const styleTag = document.createElement("style");
		el.append(styleTag);
		styleTag.append('.fl-video-player-volume-slider::before{width:'+width+' !important;}');

		if (video.volume <= 0.5) volumeIcon.classList.add('fa-volume-down');
		else volumeIcon.classList.add('fa-volume-up');
		
	}

	const changeVolume = () => {

		var val = volumeSlider.value;
	    video.volume =  val / 100;
	    volumeNumber.innerHTML = val;

	    if (val == 0) {

	    	volumeIcon.classList.add('fa-volume-off');
	    	volumeIcon.classList.remove('fa-volume-down');
	    	volumeIcon.classList.remove('fa-volume-up');

	    }	

	    else if (val <= 50) {

	    	video.muted = false;
	    	volumeIcon.classList.remove('fa-volume-off');
	    	volumeIcon.classList.add('fa-volume-down');
	    	volumeIcon.classList.remove('fa-volume-up');

	    }

	    else {

	    	video.muted = false;
	    	volumeIcon.classList.remove('fa-volume-off');
	    	volumeIcon.classList.remove('fa-volume-down');
	    	volumeIcon.classList.add('fa-volume-up');

	    }


		const maxVal = volumeSlider.getAttribute('max');
		const newVal = volumeSlider.value / maxVal;
		const width = newVal * 100 + "%";
		// el.querySelector('fl-video-player-volume-slider').style.width = ""+width+ "!important";
		// appendStyle('body','#videoPlayer .fl-video-player-volume-slider::before{width:'+width+' !important;}');

		var styleTag = document.createElement("style");
		el.append(styleTag);
		styleTag.append('.fl-video-player-volume-slider::before{width:'+width+' !important;}');

	}


	const setVolume = () => {

		var val = volumeSlider.value;
	    video.volume =  val / 100;
	    volumeNumber.innerHTML = val;

	    const maxVal = volumeSlider.getAttribute('max');
		const newVal = volumeSlider.value / maxVal;
		const width = newVal * 100 + "%";

		var styleTag = document.createElement("style");
		el.append(styleTag);
		styleTag.append('.fl-video-player-volume-slider::before{width:'+width+' !important;}');

	}

	const showElements = () => {

		if (window.innerWidth <= 991) return;

		controlbar.classList.add('fl-show');
		lockScreenBtn.classList.add('fl-show');
		bigButtonsCon.classList.add('fl-show');
		title.classList.add('fl-show');

		myFunction = setTimeout(function() { 

			controlbar.classList.remove('fl-show');
			lockScreenBtn.classList.remove('fl-show');
			bigButtonsCon.classList.remove('fl-show');
			title.classList.remove('fl-show');
			el.addEventListener('mousemove', showElements);
			clearTimeout(myFunction);

		}, 5000);

		el.removeEventListener('mousemove', showElements);

	}

	const toggleElements = () => {

		var mouseIsOver = false;
		var mySecondFunction;


		toggle = () => {

			if (mouseIsOver) return;

			controlbar.classList.toggle('fl-show');
			lockScreenBtn.classList.toggle('fl-show');
			bigButtonsCon.classList.toggle('fl-show');
			title.classList.toggle('fl-show');
			clearTimeout(myFunction);
			

			// if (window.innerWidth > 991) {

			// 		if(controlbar.classList.contains('fl-show')) showElements();

			// } else {

			if(controlbar.classList.contains('fl-show')) {
				
				clearTimeout(mySecondFunction);
				hideAfter();

			} else { el.addEventListener('mousemove', showElements); }	

			// }

		}

		const isHovered = () => { mouseIsOver = true; }

		const isNotHovered = () => { mouseIsOver = false; }

		el.addEventListener('click', toggle);
	
		controlbar.addEventListener('mouseover', isHovered);
		controlbar.addEventListener('mouseout', isNotHovered);
		lockScreenBtn.addEventListener('mouseover', isHovered);
		lockScreenBtn.addEventListener('mouseout', isNotHovered);
		bigButtonsCon.addEventListener('mouseover', isHovered);
		bigButtonsCon.addEventListener('mouseout', isNotHovered); 

		const hideAfter = () => {

			mySecondFunction = setTimeout(function() {

				controlbar.classList.remove('fl-show');
				lockScreenBtn.classList.remove('fl-show');
				bigButtonsCon.classList.remove('fl-show');
				title.classList.remove('fl-show');
				clearTimeout(mySecondFunction);
				el.addEventListener('mousemove', showElements);

			}, 5000);	

		}	

	}

    // calling-functions
    removeFullScreenClass();

    setVolume();

	// adding-functions
	startBtn.addEventListener('click', start);
	video.addEventListener('timeupdate', setCurrentTime);

	for (let i = 0; i < speedButtons.length; i++) { speedButtons[i].addEventListener('click', changeSpeed); }

	for (let i = 0; i < qualityButtons.length; i++) { qualityButtons[i].addEventListener('click', changeQuality); }

	fullScreenBtn.addEventListener('click', fullScreen);
	exitFullScreenBtn.addEventListener('click', exitFullScreen);

	if (settings.lockScreen) {

		lockScreenBtn.addEventListener('click', lock);

	}	

	volumeToggler.addEventListener('click', toggleVolume);
	volumeSlider.addEventListener('mousemove', changeVolume);
	volumeSlider.addEventListener('touchmove', changeVolume);

	timeline.addEventListener('mousemove', changeCurrentTime);

	timeline.addEventListener('mouseup', function() { 

			timelineIsFocused = true; 
			changeCurrentTime(); 
			timelineIsFocused = false;

		
		}
	);

	timeline.addEventListener('touchend', function() { 

			timelineIsFocused = true; 
			changeCurrentTime(); 
			timelineIsFocused = false;

		
		}
	);

	timeline.addEventListener('touchmove', changeCurrentTime);
	timeline.addEventListener('mousedown', function() { timelineIsFocused = true; })
  	timeline.addEventListener('touchstart', function() { timelineIsFocused = true; })


	
}
