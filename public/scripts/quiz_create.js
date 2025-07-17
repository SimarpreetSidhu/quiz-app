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

$('.question-container').on('click','.save', function(e){
  e.preventDefault();
  var quizName =$('#quiz-name').val();
  $('.quiz-name').text(quizName);
  var descriptionText =$('.description-text').val();
  console.log(descriptionText);
  $('.description-text').text(descriptionText);
})