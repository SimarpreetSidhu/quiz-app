
const questionGather = () => {
  let questionCount = 0
  $('.question-container').each(()=>{
    questionCount= $('.question-container').find('.question').length;
  });
  let questionObject = {};
  for (let i = 0; i < questionCount - 1 ; i++)
  {
    console.log(questionCount);
    questionObject[i]= {};
    questionObject[i].question = $(`#${i}`).find("textarea").val();
    questionObject[i].answeer = $(`#${i}`).find(`input[name="answer${i}"]:checked`).next('label').text();
  }
console.log(questionObject);
}



let num = 1;
$('.question-container').on('click', '.add', function(e) {
  e.preventDefault();
  $('.question:last').before(
    `<div class="question" id="${num}">
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
  $('.description-text').text(descriptionText);
  questionGather();
})
