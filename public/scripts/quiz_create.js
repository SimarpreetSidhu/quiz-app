let questionCount = 2;

const createQuestionElement = (questionNum) => {
  return `
    <div class="question" id="question-${questionNum}">
      <textarea name="quiz_question${questionNum}" required>Insert Question here</textarea>
      <input type="radio" id="true${questionNum}" name="answer${questionNum}" value="true" required>
      <label for="true${questionNum}">True</label>
      <input type="radio" id="false${questionNum}" name="answer${questionNum}" value="false">
      <label for="false${questionNum}">False</label>
      <input type="hidden" name="question_position_${questionNum}" value="${questionNum}">
      <button class="remove">Remove Question</button>
    </div>
  `;
};

// Add new question
$('.question-container').on('click', '.add', function (e) {
  e.preventDefault();
  const newQuestionHTML = createQuestionElement(questionCount);
  $(this).closest('.question').before(newQuestionHTML);
  questionCount++;
});

// Remove a question
$('.question-container').on('click', '.remove', function (e) {
  e.preventDefault();
  $(this).closest('.question').remove();
});

// Handle quiz form submit
$('.question-create').on('submit', function (e) {
  e.preventDefault();

  const quizName = $('#quiz-name').val();
  $('.quiz-name-new').text(quizName);

  const descriptionText = $('.description-text').val();
  $('.description-text').text(descriptionText);

  const formData = $(this).serialize();
  console.log("Serialized form data:", formData);

  $.ajax({
    type: "POST",
    url: "/quizzes/new",
    data: formData,
    dataType: "json",
    success: function (res) {
      console.log("Form submitted successfully:", res);

      // Optional: Redirect to share page or attempt page
      if (res.quizId) {
        window.location.href = `/quizzes/${res.quizId}/share`; // or /attempt
      } else {
        alert("Quiz saved, but no redirect link returned.");
      }
    },
    error: function (err) {
      console.error("Error submitting quiz:", err);
      alert("Something went wrong while submitting the quiz.");
    }
  });
});
