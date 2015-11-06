(function ($) {
  AblePlayer.prototype.initCued = function() {
    // set default mode for delivering description (open vs closed)
    // based on availability and user preference

    // first, check to see if there's an open-described version of this video
    // checks only the first source
    // Therefore, if a described version is provided,
    // it must be provided for all sources
    this.cuedFile = this.$sources.first().attr('data-cued-src');
    if (this.cuedFile) {
      if (this.debug) {
        console.log('This video has a cued speech version: ' + this.cuedFile);
      }
      this.hasOpenCued = true;
      if (this.prefVideo === 3) {
        this.cuedOn = true;
      }
    }
    else {
      if (this.debug) {
        console.log('This video does not have a cued speech version');
      }
      this.hasOpenCued = false;
    }

    this.updateCued();
  };

  AblePlayer.prototype.updateCued = function (time) {
    var useCuedSpeech;

    if (this.cuedOn) {
      useCuedSpeech = true;
    }
    else {
      useCuedSpeech = false;
    }

    if (this.hasOpenCued && this.usingCuedSpeech() !== useCuedSpeech) {
      this.swapCued();
    }
  };

  // Returns true if currently using cued speech, false otherwise.
  AblePlayer.prototype.usingCuedSpeech = function () {
    return (this.$sources.first().attr('data-cued-src') === this.$sources.first().attr('src'));
  };

  AblePlayer.prototype.swapCued = function() {
    // swap cued and non-cued source media, depending on which is playing
    // this function is only called in two circumstances:
    // 1. Swapping to cued version when initializing player (based on user prefs & availability)
    // 2. User is toggling description

    var i, origSrc, descSrc, srcType, jwSourceIndex, newSource;

    if (!this.usingCuedSpeech()) {
      for (i=0; i < this.$sources.length; i++) {
        // for all <source> elements, replace src with data-cued-src (if one exists)
        // then store original source in a new data-orig-src attribute
        descSrc = this.$sources[i].getAttribute('data-cued-src');
        srcType = this.$sources[i].getAttribute('type');
        if (descSrc) {
          this.$sources[i].setAttribute('src',descSrc);
        }
        if (srcType === 'video/mp4') {
          jwSourceIndex = i;
        }
      }
      if (this.initializing) { // user hasn't pressed play yet
        this.swappingSrc = false;
      }
      else {
        this.swappingSrc = true;
      }
    }
    else {
      // the cued version is currently playing
      // swap back to the original
      for (i=0; i < this.$sources.length; i++) {
        // for all <source> elements, replace src with data-orig-src
        origSrc = this.$sources[i].getAttribute('data-orig-src');
        srcType = this.$sources[i].getAttribute('type');
        if (origSrc) {
          this.$sources[i].setAttribute('src',origSrc);
        }
        if (srcType === 'video/mp4') {
          jwSourceIndex = i;
        }
      }
      // No need to check for this.initializing
      // This function is only called during initialization
      // if swapping from non-cued to cued
      this.swappingSrc = true;
    }
    // now reload the source file.
    if (this.player === 'html5') {
      this.media.load();
    }
    else if (this.player === 'jw' && this.jwPlayer) {
      newSource = this.$sources[jwSourceIndex].getAttribute('src');
      this.jwPlayer.load({file: newSource});
    }
    else if (this.player === 'youtube') {
      // Can't switch youtube tracks, so do nothing.
      // TODO: Disable open descriptions button with Youtube.
    }
  };

})(jQuery);
