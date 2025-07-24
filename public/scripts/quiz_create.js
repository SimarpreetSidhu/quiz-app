const createQuestionElement = (questionData) => {
  return $(`
    <div class="question" id="0">
        <textarea name=>Insert Question here</textarea>
        <input type="radio" id="true" name="answer0">
        <label for="true">True</label>
        <input type="radio" id="false" name="answer0">
        <label for="false">False</label>
        <button class="remove"> Remove Question</button>
      </div>
      <div class="question">`);
}

$('.question-create').on('submit',function(e){
  e.preventDefault();
  var quizName =$('#quiz-name').val();
  console.log(quizName);
  $('.quiz-name-new').text(quizName);
  var descriptionText =$('.description-text').val();
  $('.description-text').text(descriptionText);
    //questionGather();

  const formData=$('.question-create').serialize();
  console.log("serialized form data: ",formData);
  $.ajax({
    type:"POST",
    url:"/quizzes/new",
    data:formData,
    dataType:"json",
    success: function(res)
    {
      console.log("form submitted",res);
    },
    error: function(err)
    {
      console.log(err);
    }
  })
});

let num = 2;
$('.question-container').on('click', '.add', function(e) {
  e.preventDefault();
  $('.question:last').before(
    `<div class="question" id="${num}">
         <textarea name="quiz_question${num}">Insert Question here</textarea>
        <input type="radio" id="true" name="answer${num}" value="true">
        <label for="true">True</label>
        <input type="radio" id="false" name="answer${num}" value = "false">
        <label for="false">False</label>
        <input type="hidden" name = "question_position_${num}" value ="${num}">
        <button class="remove"> Remove Question</button>
      </div>`);
  num++;
});


$('.question-container').on('click', '.remove', function() {
  $(this).parent().remove();
});

//$('.question-container').on('click','.save', function(e){
  
//})
