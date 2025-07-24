$(document).ready(function () {
  $('.share-button').on('click', function () {
    const sharableUrl = $(this).data('url');
    if (sharableUrl) {
      window.open(sharableUrl, '_blank');
    } else {
      alert('No share URL found.');
    }
  });
});
