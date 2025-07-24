const express = require('express');
const router = express.Router();
const { getAttemptBySharableUrl, getQuestionsByQuizId, getAnswersByAttemptId } = require('../db/queries/quiz');

router.get('/:sharable_url', async (req, res) => {
  const sharableUrl = req.params.sharable_url;

  try {
    const attempt = await getAttemptBySharableUrl(sharableUrl);
    if (!attempt) {
      return res.status(404).send('Not found');
    }

    const questions = await getQuestionsByQuizId(attempt.quiz_id);
    const answersRows = await getAnswersByAttemptId(attempt.id);

    const userAnswers = {};
    answersRows.forEach(row => {
      userAnswers[`question-${row.question_id}`] = row.selected_answer;
    });

    res.render('result', {
      score: attempt.score,
      total: questions.length,
      questions,
      userAnswers,
      sharableUrl: attempt.sharable_url,
      quizId: attempt.quiz_id,
      isSharedView: true
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
