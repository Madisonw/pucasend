
function save_options() {

  var valueThreshold = document.getElementById('valueThreshold').value;
  var likesColor = document.getElementById('onoff').checked;
  
  chrome.storage.sync.set({
    valueThreshold: valueThreshold,
    onoff: likesColor
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
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
document.getElementById('save').addEventListener('click',
    save_options);