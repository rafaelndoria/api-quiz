import DataBase from '../models/DataBase';
import { removeQuizFavorite } from '../helpers/removeFavoriteQuiz';

export const createConfig = async (title: string, desc: string, type: string, filename: string) => {
    const newQuiz = await DataBase.create({
        title,
        desc,
        type,
        img: filename
    });

    return newQuiz;
}

export const findById = async (id: string) => {
    return await DataBase.findById(id);
}

export const findByText = async (text: string) => {
    const regex = new RegExp(text, 'i');

    const hasQuiz = await DataBase.find({
        $or: [{ title: regex }, { desc: regex }]
    });

    if(hasQuiz.length >= 1) {
        return hasQuiz;
    } else {
        return new Error('quizs does not exist');
    }
}

export const findByType = async (type: string) => {
    const quiz = await DataBase.find({ type });

    if(quiz.length >= 1) {
        return quiz
    } else {
        return new Error('quizs type does not exist');
    }
}

export const order = async (type: string) => {
    const tp = type.toLowerCase();
    const verifyType = tp === 'most' || tp === 'less' ? true : false;

    if(!verifyType) {
        return new Error('order type invalid, only most or less');
    }

    if(tp === 'most') {
        return await DataBase.find({}).sort({ plays: -1 });
    } else {
        return await DataBase.find({}).sort({ plays: 1 });
    }
}

export const createQuestion = async (idQuiz: string, title: string, correct: number, a1: string, a2: string, a3: string, a4: string, a5: string) => {
    const quiz = await findById(idQuiz);
    
    if(quiz) {
        const length = quiz.questions.length;
        if(length <= 9) {
            quiz.questions.push({
                titleAsk: title,
                alternative: [a1,a2,a3,a4,a5],
                correct
            });
            return await quiz.save();
        } else {
            return new Error('the quiz limit has been reached');
        }
    } else {
        return new Error('quiz does not exist');
    }
}

export const changeInfo = {
    changeTitle: async (idQuiz: string, title: string) => {
        await DataBase.updateOne(
            { _id: idQuiz },
            { title }
        ).then(() => true)
        .catch(() => false);
    },
    changeDesc: async (idQuiz: string, desc: string) => {
        await DataBase.updateOne(
            { _id: idQuiz },
            { desc }
        ).then(() => true)
        .catch(() => false);
    },
    changeType: async (idQuiz: string, type: string) => {
        await DataBase.updateOne(
            { _id: idQuiz },
            { type }
        ).then(() => true)
        .catch(() => false);
    },
    changeFileNameImg: async (idQuiz: string, filename: string) => {
        await DataBase.updateOne(
            { _id: idQuiz },
            { img: filename }
        ).then(() => true)
        .catch(() => false);
    }
}

export const all = async () => {
    return await DataBase.find({});
}

export const filterQuiz = async (off: number, pageNumber: number) => {
    const offset = off;
    const page = pageNumber - 1;

    if(page >= 0) {
        return await DataBase.find({}).limit(offset).skip(page); 
    } else {
        return new Error('page invalid');
    }
}


export const deleteQuiz = async (idQuiz: string, idUser: string) => {
    await DataBase.deleteOne({
        _id: idQuiz
    });
    removeQuizFavorite(idQuiz, idUser);
    return true;
}

export const playQuiz = async (idQuiz: string) => {
    const quiz = await findById(idQuiz);

    if(quiz) {
        let quizPlays = quiz?.plays;
        quiz.plays = quizPlays + 1
        await quiz.save();
        return quiz.questions;
    }
}

export const changeQuestion = async (nQuestion: number, idQuiz: string, newTitle: string) => {
    const quiz = await findById(idQuiz);
    const question = nQuestion - 1;

    if(quiz) {
        if(quiz.questions[question]) {
            quiz.questions[question].titleAsk = newTitle;
            await quiz.save();
            return quiz.questions[question].titleAsk;
        } else {
            return new Error('question not exist');
        }
    }
}

export const changeAlterntative = async (nQuestion: number, nAlternative: number, idQuiz: string, newText: string) => {
    const quiz = await findById(idQuiz);
    const question = nQuestion - 1;
    const alternative = nAlternative - 1;

    if(quiz) {
        if(quiz.questions[question].alternative[alternative]) {
            quiz.questions[question].alternative[alternative] = newText;
            await quiz.save();
            return quiz.questions[question].alternative[alternative];
        } else {
            return new Error('question does not exist');
        }
    }
}

export const changeCorrect = async (nQuestion: number, idQuiz: string, newCorrect: number) => {
    const quiz = await findById(idQuiz);
    const question = nQuestion - 1;

    if(quiz) {
        if(quiz.questions[question].correct) {
            quiz.questions[question].correct = newCorrect;
            await quiz.save();
            return quiz.questions[question].correct;
        } else {
            return new Error('question does not exist');
        }
    }
}