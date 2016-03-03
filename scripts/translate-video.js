  (function ($) {
  AblePlayer.prototype.initTranslate = function() {
    // set default mode for delivering description (open vs closed)
    // based on availability and user preference

    // first, check to see if there's an open-described version of this video
    // checks only the first source
    // Therefore, if a described version is provided,
    // it must be provided for all sources
    this.translateFile = this.$sources.first().attr('data-translate-src');
    if (this.translateFile) {
      if (this.debug) {
        console.log('This video has a translated version: ' + this.translateFile);
      }
      this.hasOpenTranslate = true;
      if (this.prefVideo === 3) {
        this.translateOn = true;
      }
    }
    else {
      if (this.debug) {
        console.log('This video does not have a translated version');
      }
      this.hasOpenTranslate = false;
    }

    this.updateTranslate();
  };

  AblePlayer.prototype.updateTranslate = function (time) {
    var useTranslate;

    if (this.translateOn) {
      useTranslate = true;
    }
    else {
      useTranslate = false;
    }

    if (this.hasOpenTranslate && this.usingTranslate() !== useTranslate) {
      this.swapTranslate();
    }
  };

  // Returns true if currently using translated, false otherwise.
  AblePlayer.prototype.usingTranslate = function () {
    return (this.$sources.first().attr('data-translate-src') === this.$sources.first().attr('src'));
  };

  AblePlayer.prototype.swapTranslate = function() {
    // swap translated and non-translated source media, depending on which is playing
    // this function is only called in two circumstances:
    // 1. Swapping to translated version when initializing player (based on user prefs & availability)
    // 2. User is toggling description

    var i, origSrc, translateSrc, srcType, jwSourceIndex, newSource;

    if (!this.usingTranslate()) {
      for (i=0; i < this.$sources.length; i++) {
        // for all <source> elements, replace src with data-translate-src (if one exists)
        // then store original source in a new data-orig-src attribute
        translateSrc = this.$sources[i].getAttribute('data-translate-src');
        srcType = this.$sources[i].getAttribute('type');
        if (translateSrc) {
          this.$sources[i].setAttribute('src',translateSrc);
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
      // the translated version is currently playing
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
      // if swapping from non-translated to translated
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
