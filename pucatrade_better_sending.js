
var BetterSend = function(options) {
  options = options || {};
  this.options = options

  this.clearIndexes();
  this.highlightGoodTrades();
  this.setupNewDataLongPoll();
}

BetterSend.prototype.clearIndexes = function() {
  this.userPointIndex = {};
  this.userTRIndex = {};
  this.userValueIndex = {};
};

BetterSend.prototype.addToTRIndex = function(userId,$tr) {
  if (this.userTRIndex[userId]) {
    this.userTRIndex[userId].push($tr);
  } else {
    this.userTRIndex[userId] = [$tr];
  }
};

BetterSend.prototype.addToPointIndex = function(userId,points) {
  this.userPointIndex[userId] = points;
};

BetterSend.prototype.addToValueIndex = function(userId,points) {
  if (this.userValueIndex[userId]) {
    this.userValueIndex[userId]+=points;
  } else {
    this.userValueIndex[userId]=points;
  }
};

BetterSend.prototype.highlightGoodTrades = function() {
  var self = this;

  $("#wrap-main tbody tr").each(function() {
    var userId = null;
    var targetHref = null;
    var tradeValue = parseInt($(this).find(".value").text(),10);
    var userPoints = parseInt($(this).find(".points").text(),10);
    //first, lets get the userId and the href to search on.
    $(this).find(".member a").each(function() {
      var hrefUrl = $(this).attr("href").split("/");
      if (hrefUrl && hrefUrl[3] && parseInt(hrefUrl[3])) {
        userId = hrefUrl[3];
        targetHref = $(this).attr("href");
      }
    })
    self.addToTRIndex(userId,$(this));
    self.addToValueIndex(userId,tradeValue);
    self.addToPointIndex(userId,userPoints);
  });

  for (var userId in this.userPointIndex) {
    if (this.userValueIndex[userId] >= this.options.valueThreshold && this.userPointIndex[userId] >= this.userValueIndex[userId]) {
      //if they have enough points and its above or equal to the threshold
      this.userTRIndex[userId].forEach(function($tr) {
        $tr.addClass("good-trade");
      })
    }
  }

  if (this.options.hideBadTrades) {
    this.hideBadTrades();
  }
};

BetterSend.prototype.hideBadTrades = function() {
  $("#wrap-main tbody tr:not(.good-trade)").hide();
};

BetterSend.prototype.refreshHighlights = function() {
  $(".good-trade").removeClass("good-trade");
  this.highlightGoodTrades();
};

BetterSend.prototype.setupNewDataLongPoll = function() {
  var self = this;
  var loadingElement = $("#sort-loading");

  var newDataPoll = setInterval(function() {
    if ($("#fancybox-loading")[0]) {
      clearInterval(newDataPoll);

      var detectionInterval = setInterval(function() {
        if (!$("#fancybox-loading")[0]) {
          self.clearIndexes();
          self.refreshHighlights();
          clearInterval(detectionInterval);
          self.setupNewDataLongPoll();
        }
      },50);
    }
  },200);
}; 
chrome.storage.sync.get({
  valueThreshold: 100,
  onoff: true
}, function(options) {
  if (!options.onoff) return false;
  var bettersend = new BetterSend(options);
});


