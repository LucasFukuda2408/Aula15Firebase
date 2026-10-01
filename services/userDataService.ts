import{addDoc,collection,doc,setDoc} from "firebase/firestore"
<<<<<<< HEAD

//Importando o db
import { db } from "./firebaseConfig"

//Estrutura basica para operaçoes vinculadas ao usuario
type UsuarioBase = {
    uid: string;
    email:string|null;
}

//Cria o perfil do usuario no firestore
export async function CriarPerfilUsuario(usuario: UsuarioBase & {nome?:string}){
=======
//Importando o db
import { db } from "./firebaseConfig"
//Estrutura basica para operaçoes vinculadas ao usuario
type UsuarioBase = {
    uid:string,
    email:string|null,
}

//Cria o perfil do usuario no firestore
export async function criarPerfilUsuario(usuario: UsuarioBase & {nome?:string}){
>>>>>>> 9f473efe341c4e447a3973259745d4d1f3570e54
    //Criar um objeto que será salvo no firestore
    const dados = {
        //Salva o UID do usuário
        uid: usuario.uid,
        email:usuario.email,
        nome:usuario.nome
    }
<<<<<<< HEAD
=======
    
>>>>>>> 9f473efe341c4e447a3973259745d4d1f3570e54
    //Salva os dados(objteto) na colecao "usuarios"
    await setDoc(
        //O UID será utilizazo como documento
        doc(db,"usuarios",usuario.uid),
        dados
    )
}

//Função para salvar produto vinculado ao usuario
export async function salvarProdutoUsuario(uid:string, nomeProduto:string){
<<<<<<< HEAD
=======
    
>>>>>>> 9f473efe341c4e447a3973259745d4d1f3570e54
    //Cria um novo documento na coleção produtos
    //usuarios -> UID do usuario -> produtos
    return addDoc(
        collection(db,"usuarios",uid,"produtos"),
        //Dados do produto
        {
            nomeProduto,
            isChecked:false
        }
    )   
}
<<<<<<< HEAD
=======

>>>>>>> 9f473efe341c4e447a3973259745d4d1f3570e54
