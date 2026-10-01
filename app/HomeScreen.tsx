import { Text, Button,Alert,TextInput,StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {auth,db} from "../services/firebaseConfig"
import { deleteUser,onAuthStateChanged } from "firebase/auth";
import ItemLoja from "../components/itemLoja";
import { useState,useEffect} from "react";  
import { salvarProdutoUsuario } from "../services/userDataService";
import { collection,onSnapshot } from "firebase/firestore";

type Produto = {
    id:string,
    nomeProduto:string
}

export default function HomeScreen() {
    const[produtos,setProdutos]=useState<Produto[]>([])    
    const[title,setTitle]=useState("");

    const router = useRouter(); //Hook de navegação

useEffect(()=>{
        //Observa o estado de autenticação do usuário
        //descobrir quem o usuário
        //
        const unsubscribeAuth = onAuthStateChanged(auth,(user)=>{
            if(!user){
                setProdutos([])
                return
            }
             //Cria um referência para a subcoleção "produtos"
            const produtosRef = collection(db,"usuarios",user.uid,"produtos")

            //Ficar observando o firestore para verificar se houve atualização
            //nos produtos(salvar,editar,excluido)
            const unsubscribeProdutos = onSnapshot(produtosRef,(snapshot)=>{
                //Convertendo os documentos para objeto
                const dados = snapshot.docs.map((item)=>({
                    //pegando o id do produto
                    id:item.id,
                    nomeProduto:(item.data().nomeProduto as string) ?? ""
                }));
                //Atualizado no estado
                setProdutos(dados);
                console.log(produtos)
            })
             //Cancela a observa dos produtos
            return unsubscribeProdutos
        })
        //Cancela a observação da autenticação
        return unsubscribeAuth
    },[])

    const salvarItem = async()=>{
        const user = auth.currentUser
        if(!user) return //Validação simples para verificar se o user está logado

        try{
            await salvarProdutoUsuario(user.uid,title.trim())
            setTitle("")//Limpa o TextInput
            console.log("Produto Cadastrado")

        }catch(e){
            console.log("Error ao salvar produto:",e)
        }



    }

    const realizarLogoff = async () => {
        await AsyncStorage.removeItem("@user")
        router.replace("/")
    }

    const excluirConta = ()=>{
        Alert.alert(
            "Confirmar Exclusão",
            "Tem certeza que deseja excluir sua conta?",
            [
                {text:"Cancelar"},
                {
                    text:"Confirmar Exclusão",
                    onPress:async()=>{
                        try{
                            const user = auth.currentUser;
                            if(user){
                                await deleteUser(user);
                                await AsyncStorage.removeItem("@user");
                                Alert.alert("Conta excluída","Sua foi excluída com sucesso");
                                router.replace("/")
                            }
                        }catch(e){
                            console.log("Error ao excluir conta:",e);
                            alert("Não possivel deletar a conta.")
                        }
                    }

                }
            ]
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text>Olá, Você está na Tela Inicial</Text>
            <Button
                title="Sair da Conta"
                onPress={realizarLogoff}
            />
            <Button 
                title="Excluir Conta"
                color="#d72c2c"
                onPress={excluirConta}
            />

           
            
            
            <TextInput 
                placeholder="Digite o nome do produto"
                style = {styles.input}
                value={title}
                onChangeText={(value)=>setTitle(value)}
                onSubmitEditing={salvarItem}
            />

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1
    },
    input:{
        backgroundColor:"lightgrey",
        padding:10,
        fontSize:15,
        width:"90%",
        alignSelf:"center",
        borderRadius:10,
        marginTop:"auto"
    }
})