const updateVisibility = (quizId, isPrivate) => {
  $.ajax({
    url: `/quizzes/${quizId}/visibility`,
    method: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({ visibility: !isPrivate }), // visibility = public
    success: () => {
      $('#visibility-text-' + quizId).text(isPrivate ? 'Private' : 'Public');
    },
    error: (xhr, status, error) => {
      alert('Error changing visibility: ' + error);
    }
  });
};

$(() => {
  $('.toggle-switch').each(function () {
    const $toggle = $(this);

    $toggle.on('click', function () {
      const quizId = $toggle.data('quiz-id');
      const isPublic = $toggle.data('is-public');
      const newVisibility = !isPublic;

      // Send to server
      updateVisibility(quizId, newVisibility);

      // Toggle visual change
      $toggle.removeClass(isPublic ? 'public' : 'private');
      $toggle.addClass(newVisibility ? 'public' : 'private');

      // Update visibility text
      $('#visibility-text-' + quizId).text(newVisibility ? 'Public' : 'Private');

      // Update the data attribute
      $toggle.data('is-public', newVisibility);
    });
  });
});

