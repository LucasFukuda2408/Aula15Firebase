import { Text, Button, Alert, TextInput, StyleSheet, FlatList, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
<<<<<<< HEAD
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
=======
import { auth, db } from "../services/firebaseConfig"
import { deleteUser, onAuthStateChanged } from "firebase/auth";
import ItemLoja from "../components/itemLoja";
import { useState, useEffect } from "react";
import { salvarProdutoUsuario } from "../services/userDataService";
import { collection, onSnapshot, doc,deleteDoc, updateDoc } from "firebase/firestore"
import { useTranslation } from "react-i18next";
//Componentes prontos para criar o modal
import { Provider as PaperProvider, Portal, Dialog } from "react-native-paper"


type Produto = {
    id: string,
    nomeProduto: string
}


export default function HomeScreen() {
    const [produtos, setProdutos] = useState<Produto[]>([])
    const [title, setTitle] = useState("");
    const [modalVisible, setModalVisible] = useState(false)
    const [produtoEditado, setProdutoEditado] = useState<Produto | null>(null)
    const [nomeEditado, setNomeEditado] = useState("")

    const router = useRouter(); //Hook de navegação

    const{t}=useTranslation();
    useEffect(() => {
        //Observa o estado de autenticação do usuário
        //descobrir quem o usuário
        //
        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            if (!user) {
                setProdutos([])
                return
            }

            //Cria um referência para a subcoleção "produtos"
            const produtosRef = collection(db, "usuarios", user.uid, "produtos")

            //Ficar observando o firestore para verificar se houve atualização
            //nos produtos(salvar,editar,excluido)
            const unsubscribeProdutos = onSnapshot(produtosRef, (snapshot) => {
                //Convertendo os documentos para objeto
                const dados = snapshot.docs.map((item) => ({
                    //pegando o id do produto
                    id: item.id,
                    nomeProduto: (item.data().nomeProduto as string) ?? ""

                }));
                setProdutos(dados)
                console.log(dados)

            })
            //Cancela a observa dos produtos
>>>>>>> 9f473efe341c4e447a3973259745d4d1f3570e54
            return unsubscribeProdutos
        })
        //Cancela a observação da autenticação
        return unsubscribeAuth
<<<<<<< HEAD
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
=======
    }, [])

    const salvarItem = async () => {
        const user = auth.currentUser
        if (!user) return //Validação simples para verificar se o user está logado

        try {
            await salvarProdutoUsuario(user.uid, title.trim())
            setTitle("")//Limpa o TextInput
            console.log("Produto Cadastrado")

        } catch (e) {
            console.log("Error ao salvar produto:", e)
>>>>>>> 9f473efe341c4e447a3973259745d4d1f3570e54
        }



    }

    const realizarLogoff = async () => {
        await AsyncStorage.removeItem("@user")
        router.replace("/")
    }

    const excluirConta = () => {
        Alert.alert(
            "Confirmar Exclusão",
            t("confirmDelete"),
            [
                { text: "Cancelar" },
                {
                    text: "Confirmar Exclusão",
                    onPress: async () => {
                        try {
                            const user = auth.currentUser;
                            if (user) {
                                await deleteUser(user);
                                await AsyncStorage.removeItem("@user");
                                Alert.alert("Conta excluída", "Sua foi excluída com sucesso");
                                router.replace("/")
                            }
                        } catch (e) {
                            console.log("Error ao excluir conta:", e);
                            alert("Não possivel deletar a conta.")
                        }
                    }

                }
            ]
        )
    }

    //Selecionar o produto e abrir o modal
    const editarProduto = (produto: Produto) => {
        setProdutoEditado(produto)
        setNomeEditado(produto.nomeProduto)
        setModalVisible(true)
    }

    const salvarEdicao = async () => {
        const user = auth.currentUser
        if (!user || !produtoEditado) return;

        const novoNome = nomeEditado.trim()

        if (!novoNome) {
            Alert.alert("Atenção", "Digite um nome para o produto")
            return
        }

        try {
            const produtoRef = doc(
                db,
                "usuarios",
                user.uid,
                "produtos",
                produtoEditado.id
            )

            //Atualizando o campo nome produto no firestore
            await updateDoc(produtoRef, {
                nomeProduto: novoNome
            })

            setModalVisible(false)
            setProdutoEditado(null)
            console.log("Produto Atualizado com sucesso")
        } catch (e) {
            console.log("Error ao atualizar o produto:", e)
            Alert.alert("Error", "Não foi possível atualizar o produto.")
        }

    }

    const fecharModal=()=>{
        setModalVisible(false)
        setProdutoEditado(null)
        setNomeEditado("")
    }


    //Função para excluir o produto
    const excluirProduto = (produto:Produto)=>{
        Alert.alert(
            "Excluir Produto",
            `Deseja excluir o produto \"${produto.nomeProduto}`,
            [
                {text:"Cancelar",style:"cancel"},
                {
                    text:"Excluir" ,
                    style:"destructive",
                    onPress:async()=>{
                        const user = auth.currentUser;
                        if(!user){
                            Alert.alert("Error","Nenhum usuário logado.")
                            return
                        }

                        try{
                             //Referência do documento que será deletado
                            const produtoRef = doc(db,"usuarios",user.uid,"produtos",produto.id) 
                            
                            //Remove o documento(produto) do firestore
                            await deleteDoc(produtoRef)

                            Alert.alert("Sucesso","Produto deletado com sucesso.")                            
                            
                            
                        }catch(e){
                            console.log("Error ao excluir produto:",e)
                            Alert.alert("Erro","Não foi possível excluir o produto.")
                        }

                    }


                }
            ]
        )
    }

    return (
        <PaperProvider>
            <KeyboardAvoidingView
                style={styles.keyboardContainer}
                //No iOS usamos padding
                //No Android usamos "height"
                behavior={Platform.OS === "ios" ? "padding" : "height"}

<<<<<<< HEAD
           
            
            
            <TextInput 
                placeholder="Digite o nome do produto"
                style = {styles.input}
                value={title}
                onChangeText={(value)=>setTitle(value)}
                onSubmitEditing={salvarItem}
            />
=======
                //Espaço adicional para evitar que o teclado cubra o conteúdo
                keyboardVerticalOffset={0}
            >
>>>>>>> 9f473efe341c4e447a3973259745d4d1f3570e54


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

                    <FlatList
                        data={produtos}
                        style={styles.lista}
                        contentContainerStyle={styles.listaConteudo}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => <ItemLoja 
                                    nomeProduto={item.nomeProduto}
                                    onEditPress={()=>editarProduto(item)}
                                    onDeletePress={()=>excluirProduto(item)}
                                    />}
                        ListEmptyComponent={<Text style={styles.emptyText}>Nenhum produto cadastrado</Text>}

                    />




                    <TextInput
                        placeholder="Digite o nome do produto"
                        style={styles.input}
                        value={title}
                        onChangeText={(value) => setTitle(value)}
                        onSubmitEditing={salvarItem}
                    />

                    <Portal>
                        <Dialog
                            visible={modalVisible}
                            onDismiss={fecharModal}
                        >
                            <Dialog.Title>
                                Editar Produto
                            </Dialog.Title>

                            <Dialog.Content>
                                <TextInput 
                                    value={nomeEditado}
                                    onChangeText={setNomeEditado}
                                    placeholder="Nome do produto"
                                    style={styles.modalInput}
                                />
                            </Dialog.Content>

                            <Dialog.Actions>
                                <Button title="Cancel" onPress={fecharModal}/>
                                <Button title="Salvar" onPress={salvarEdicao}/>
                            </Dialog.Actions>
                        </Dialog>
                    </Portal>


                </SafeAreaView>
            </KeyboardAvoidingView>
        </PaperProvider>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    input: {
        backgroundColor: "lightgrey",
        padding: 10,
        fontSize: 15,
        width: "90%",
        alignSelf: "center",
        borderRadius: 10,
        marginTop: "auto"
    },
    lista: {
        width: "100%",
        marginTop: 16,
        flex: 1
    },
    listaConteudo: {
        gap: 8,
        paddingBottom: 12
    },
    emptyText: {
        textAlign: "center",
        marginTop: 20
    },
    keyboardContainer: {
        flex: 1
    },
    modalInput:{
        backgroundColor:"#eeeeee",
        padding:10,
        borderRadius:8
    }
})