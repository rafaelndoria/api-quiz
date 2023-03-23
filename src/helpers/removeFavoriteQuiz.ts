import { findUserById } from "../services/UserService";

export const removeQuizFavorite = async (idQuiz: string, idUser: string) => {
    const user = await findUserById(idUser);
    if(user) {
        const array = user.data_bases;
        const index = array.indexOf(idQuiz);
        if (index > -1) {
            array.splice(index, 1);
            await user.save();
        }
    }
}

export default removeQuizFavorite;