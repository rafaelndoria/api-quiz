import DataBase from '../models/DataBase';

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