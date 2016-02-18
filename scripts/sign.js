(function ($) {
  AblePlayer.prototype.initSignLanguage = function() {
    // set default mode for delivering description (open vs closed)
    // based on availability and user preference

    // first, check to see if there's an open-described version of this video
    // checks only the first source
    // Therefore, if a described version is provided,
    // it must be provided for all sources
    this.signFile = this.$sources.first().attr('data-sign-src');
    if (this.signFile) {
      if (this.debug) {
        console.log('This video has a sign language version: ' + this.translateFile);
      }
      this.hasSignLanguage = true;
      if (this.prefVideo === 2) {
        this.signOn = true;
      }
    }
    else {
      if (this.debug) {
        console.log('This video does not have a sign language version');
      }
      this.hasSignLanguage = false;
    }

    this.updateSign();
  };

  AblePlayer.prototype.updateSign = function (time) {
    var useSign;

    if (this.signOn) {
      useSign = true;
    }
    else {
      useSign = false;
    }

    if (this.hasSignLanguage && this.usingSign() !== useSign) {
      this.swapSign();
    }
  };

  // Returns true if currently using cued speech, false otherwise.
  AblePlayer.prototype.usingSign = function () {
    return (this.$sources.first().attr('data-sign-src') === this.$sources.first().attr('src'));
  };

  AblePlayer.prototype.swapSign = function() {
    // swap cued and non-cued source media, depending on which is playing
    // this function is only called in two circumstances:
    // 1. Swapping to cued version when initializing player (based on user prefs & availability)
    // 2. User is toggling description

    var i, origSrc, descSrc, srcType, jwSourceIndex, newSource;

    if (!this.usingSign()) {
      for (i=0; i < this.$sources.length; i++) {
        // for all <source> elements, replace src with data-translate-src (if one exists)
        // then store original source in a new data-orig-src attribute
        descSrc = this.$sources[i].getAttribute('data-sign-src');
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
