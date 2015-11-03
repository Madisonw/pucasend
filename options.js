
function save_options() {
  var valueThreshold = document.getElementById('valueThreshold').value;
  var likesColor = document.getElementById('onoff').checked;
  
  chrome.storage.sync.set({
    valueThreshold: valueThreshold,
    onoff: likesColor
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  chrome.storage.sync.get({
    valueThreshold: 100,
    onoff: true
  }, function(items) {
    document.getElementById('valueThreshold').value = items.valueThreshold;
    document.getElementById('onoff').checked = items.onoff;
  });
}
document.addEventListener('DOMContentLoaded', restore_options);

document.getElementById('valueThreshold').addEventListener("keyup", save_options);
document.getElementById('onoff').addEventListener("change", save_options);