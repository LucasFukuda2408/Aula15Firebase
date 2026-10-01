import{addDoc,collection,doc,setDoc} from "firebase/firestore"

//Importando o db
import { db } from "./firebaseConfig"

//Estrutura basica para operaçoes vinculadas ao usuario
type UsuarioBase = {
    uid: string;
    email:string|null;
}

//Cria o perfil do usuario no firestore
export async function CriarPerfilUsuario(usuario: UsuarioBase & {nome?:string}){
    //Criar um objeto que será salvo no firestore
    const dados = {
        //Salva o UID do usuário
        uid: usuario.uid,
        email:usuario.email,
        nome:usuario.nome
    }
    //Salva os dados(objteto) na colecao "usuarios"
    await setDoc(
        //O UID será utilizazo como documento
        doc(db,"usuarios",usuario.uid),
        dados
    )
}

//Função para salvar produto vinculado ao usuario
export async function salvarProdutoUsuario(uid:string, nomeProduto:string){
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
