const numberOfQuestions = () => {
  console.log($('.question-container').children().length());
};
let num = 0;
$('.question-container').on('click', '.add', function(e) {
  e.preventDefault();
  $('.question:last').before(
    `<div class="question">
        <textarea>Insert Question here</textarea>
        <input type="radio" id="true" name="answer${num}">
        <label for="true">True</label>
        <input type="radio" id="false" name="answer${num}">
        <label for="false">False</label>
        <button class="remove"> Remove Question</button>
      </div>`);
  num++;
});

$('.question-container').on('click', '.remove', function() {
  console.log("this");
  $(this).parent().remove();
});