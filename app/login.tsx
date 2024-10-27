import { signIn } from '@/data/authData';
import { useState } from 'react';
import { StyleSheet, SafeAreaView, ScrollView, StatusBar, Image, View, Text, TextInput, TouchableOpacity } from 'react-native';

export default function Login() {
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [password, setPassword] = useState('');

    const handleEmail = (text: string) => {
        setEmail(text);
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(text)) {
            setEmailError('Email inválido');
        } else {
            setEmailError('');
        }
    };

    const handlePassword = (text: string) => {
        setPassword(text);
    };

    const handleLogin = async (email: string, password: string) => {
        try {
            const user = await signIn(email, password);
            console.log(user) //PAREI AQUI
          } catch (error) {
            console.error("Erro no login:", error);
          }
    };

    const handleCreateAccount = () => {
        
    };

    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>


                <Image
                    source={require('../assets/images/loginImage.png')}
                    style={styles.image}
                />
                <Text style={styles.title}>Fazer Login</Text>
                <View style={styles.cardContainer}>
                    <View style={styles.card}>

                        <TextInput
                            style={styles.inputText}
                            placeholder='Email'
                            placeholderTextColor='#45B3AF'
                            value={email}
                            onChangeText={handleEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}


                        <TextInput
                            style={styles.inputText}
                            placeholder='Senha'
                            placeholderTextColor='#45B3AF'
                            value={password}
                            onChangeText={handlePassword}
                            secureTextEntry={true}
                        />

                        <View style={styles.buttons}>

                            <TouchableOpacity
                                style={styles.createButton}
                                onPress={() => handleCreateAccount()}
                            >
                                <Text style={styles.createButtonText}>
                                    Criar uma conta
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.loginButton}
                                onPress={() => handleLogin(email, password)}>
                                <Text style={styles.loginButtonText}>
                                    Entrar
                                </Text>
                            </TouchableOpacity>

                        </View>



                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: StatusBar.currentHeight || 0,
        backgroundColor: "white",
        justifyContent: 'center',
    },
    imageContainer: {
        justifyContent: 'flex-start',
        alignItems: "center"
    },
    image: {
        resizeMode: 'cover',

    },
    title: {
        position: 'absolute',
        fontSize: 48,
        top: 0,
        fontWeight: '500',
        color: "#C0E5E4"
    },
    cardContainer: {
        position: 'absolute',
        top: 80,
    },
    card: {
        borderWidth: 1,
        borderColor: 'white',
        backgroundColor: 'white',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        margin: 10,
        padding: 5,
    },
    inputText: {
        borderWidth: 1,
        borderColor: '#45B3AF',
        backgroundColor: 'white',
        borderRadius: 20,
        paddingLeft: 10,
        paddingRight: 10,
        margin: 5,
        width: 250,
        height: 50,
        color: '#45B3AF'
    },
    errorText: {
        color: 'red',
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginTop: 10

    },
    createButton: {
        backgroundColor: '#E5E5E5',
        borderRadius: 7,
        paddingTop: 3,
        paddingBottom: 3,
        paddingLeft: 10,
        paddingRight: 10,
        marginRight: 10,
    },
    createButtonText: {
        color: 'black',
        padding: 5
    },
    loginButton: {
        backgroundColor: '#45B3AF',
        borderRadius: 7,
        paddingTop: 3,
        paddingBottom: 3,
        paddingLeft: 10,
        paddingRight: 10,
        marginLeft: 10,
    },
    loginButtonText: {
        color: 'white',
        padding: 5
    },

});