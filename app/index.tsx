import { Link } from 'expo-router';
import React, { useState,useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { signInWithEmailAndPassword,sendPasswordResetEmail } from 'firebase/auth';
import {auth} from "../services/firebaseConfig"
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';

export default function LoginScreen() {
  const router = useRouter()//Hook de navegação

  const{t,i18n}=useTranslation();

  // Estados para armazenar os valores digitados
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  //useEffect para verificar se há usuário salvo no Async
  useEffect(()=>{
    const verificarUsuarioLogado = async()=>{
      try{
        const usuarioSalvo = await AsyncStorage.getItem("@user")
        if(usuarioSalvo){
          router.replace("/HomeScreen")
        }

      }catch(error){
        console.log("Error ao verificar login:",error)
      }
    }
    verificarUsuarioLogado();
  },[])

  //Função para alterar o idioma
  const mudarIdioma = (lang:string)=>{
    i18n.changeLanguage(lang);
  }

  // Função para simular o envio do formulário
  const handleLogin= () => {
    if ( !email || !senha) {
      Alert.alert('Atenção', 'Preencha todos os campos!');
      return;
    }

    signInWithEmailAndPassword(auth,email,senha)
      .then(async(userCredential)=>{
        const user = userCredential.user
        console.log(user);

        //Salva o usuário no Async
        await AsyncStorage.setItem("@user",JSON.stringify(user));

        router.replace("/HomeScreen");
      })
      .catch((error)=>{
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("Mensagem:",errorMessage);
        Alert.alert("Error","Credenciais inválidas! Verique e-mail e senha");
      
      })

  };

  const esqueceuSenha = ()=>{
    //Validação simples do campo e-mail
    if(!email){
      alert("Digite o e-mail para recuperar a senha")
      return
    }
    sendPasswordResetEmail(auth,email)
      .then(()=>{
        alert("E-mail de redefinição enviado com sucesso!");
      })
      .catch((error)=>{
        console.log("Erro ao enviar email de redefinação", error.message);
        alert("Error ao enviar e-mail")
      })
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>{t("welcome")}</Text>


      {/* Campo Email */}
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        placeholderTextColor="#aaa"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      {/* Campo Senha */}
      <TextInput
        style={styles.input}
        placeholder={t("password")}
        placeholderTextColor="#aaa"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />
      <View style={{flexDirection:"row"}}>
        <TouchableOpacity
          onPress={()=>mudarIdioma("pt")}
        >
          <Text style={[styles.textoBotao,{marginRight:15}]}>PT</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={()=>mudarIdioma("en")}
        >
          <Text style={styles.textoBotao}>EN</Text>
        </TouchableOpacity>
      </View>
      {/* Botão */}
      <TouchableOpacity style={styles.botao} onPress={handleLogin}>
        <Text style={styles.textoBotao}>{t("login")}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={esqueceuSenha}>
        <Text style={styles.esqueceuSenhaText}>Esqueceu a senha</Text>
      </TouchableOpacity>

      <Link href="CadastrarScreen" style={{marginTop:20,color:'white',marginLeft:150}}>Cadastre-se</Link>
    </View>
  );
}

// Estilização
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    padding: 20,
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#1E1E1E',
    color: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  botao: {
    backgroundColor: '#00B37E',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  textoBotao: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  esqueceuSenhaText:{
    color:"#fff",
    marginTop:12,
    fontSize:14,
    marginLeft:120
  }
});
