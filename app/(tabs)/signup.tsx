import { createUser, signIn } from '@/data/authData';
import { useEffect, useState } from 'react';
import { StyleSheet, StatusBar, Image, View, Text, TextInput, TouchableOpacity } from 'react-native';

import { useRouter } from 'expo-router';
import { BackHandler } from 'react-native';

import * as ImagePicker from 'expo-image-picker';
import { addUser } from '@/data/insertData';
import { useIsFocused } from '@react-navigation/native';

export default function SignUp() {
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');

    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const [name, setName] = useState('');
    const [nameError, setNameError] = useState('');

    const [username, setUsername] = useState('');
    const [usernameError, setUsernameError] = useState('');

    const [background_image, setBackground_image] = useState("");
    const [background_imageError, setBackground_imageError] = useState('');

    const [profile_image, setProfile_image] = useState("");
    const [profile_imageError, setProfile_imageError] = useState('');

    const [localImageBackground, setLocalImageBackground] = useState('');
    const [localImageProfile, setLocalImageProfile] = useState('');

    const isFocused = useIsFocused();

    useEffect(() => {
        if (isFocused) {
            setEmail("")
            setPassword("")
            setName("")
            setUsername("")
            setProfile_image("")
            setLocalImageProfile("")
            setBackground_image("")
            setLocalImageBackground("")
        }
    }, [isFocused]);

    useEffect(() => {
        const handleBackPress = () => {
            router.push('/(tabs)');
            return true;
        };

        BackHandler.addEventListener('hardwareBackPress', handleBackPress);

        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
        };
    }, [router]);

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
        if (text) {
            setPasswordError('');
        }
    };

    const handleName = (text: string) => {
        setName(text);
        if (text) {
            setNameError('');
        }
    };

    const handleUsername = (text: string) => {
        setUsername(text);
        if (text) {
            setUsernameError('');
        }
    };

    const pickImageBackground = async () => {
        // Solicitar permissão para acessar a galeria
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            console.log("sem acesso")
            return;
        }

        setBackground_imageError('');

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            const uri = result.assets[0].uri;
            setLocalImageBackground(result.assets[0].uri);
            setBackground_image(result.assets[0].uri);
        }

    }

    const pickImageProfile = async () => {
        // Solicitar permissão para acessar a galeria
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            console.log("sem acesso")
            return;
        }

        setProfile_imageError('');

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            const uri = result.assets[0].uri;
            setLocalImageProfile(result.assets[0].uri);
            setProfile_image(result.assets[0].uri);
        }

    }



    const handleCreateAccount = async (email: string, password: string,
        name: string, username: string, profile_image: string, background_image: string
    ) => {
        try {
            if (!email) {
                setEmailError('O email é obrigatório');
                return;
            }

            if (!password) {
                setPasswordError('A senha é obrigatória.');
                return;
            }
            if (!name) {
                setNameError('O nome é obrigatório');
                return;
            }

            if (!username) {
                setUsernameError('O usuário é obrigatório');
                return;
            }

            if (!background_image) {
                setBackground_imageError('A foto de capa é obriatória');
                return;
            }

            if (!profile_image) {
                setProfile_imageError('A foto de perfil é obriatória');
                return;
            }
            const user_id = await createUser(email, password);

            if (user_id) {
                const user = {
                    name: name,
                    username: username,
                    profile_image: profile_image,
                    background_image: background_image
                }

                await addUser(user, user_id)
                router.push({
                    pathname: '/(tabs)'
                })
            }

        } catch (error) {
            console.error("Erro no login:", error);
        }
    };



    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>


                <Image
                    source={require('../../assets/images/signup.png')}
                    style={styles.image}
                />
                <Text style={styles.title}>Criar conta</Text>
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
                        {emailError ? <Text style={{ color: 'red' }}>{emailError}</Text> : null}


                        <TextInput
                            style={styles.inputText}
                            placeholder='Senha'
                            placeholderTextColor='#45B3AF'
                            value={password}
                            onChangeText={handlePassword}
                            secureTextEntry={true}
                        />
                        {passwordError ? <Text style={{ color: 'red' }}>{passwordError}</Text> : null}

                        <TextInput
                            style={styles.inputText}
                            placeholder='Nome'
                            placeholderTextColor='#45B3AF'
                            value={name}
                            onChangeText={handleName}
                        />
                        {nameError ? <Text style={{ color: 'red' }}>{nameError}</Text> : null}

                        <TextInput
                            style={styles.inputText}
                            placeholder='Usuário'
                            placeholderTextColor='#45B3AF'
                            value={username}
                            onChangeText={handleUsername}
                        />
                        {usernameError ? <Text style={{ color: 'red' }}>{usernameError}</Text> : null}

                        <TouchableOpacity
                            onPress={pickImageBackground}
                        >
                            {localImageBackground && <Image source={{ uri: localImageBackground }} style={styles.modalImage} />}
                            {!localImageBackground && <Image
                                style={styles.modalImage}
                                source={require('../../assets/images/addImage.png')}
                            />}

                        </TouchableOpacity>
                        {background_imageError ? <Text style={{ color: 'red' }}>{background_imageError}</Text> : null}

                        <TouchableOpacity
                            onPress={pickImageProfile}
                        >
                            {localImageProfile && <Image source={{ uri: localImageProfile }} style={styles.profileImage} />}
                            {!localImageProfile && <Image
                                style={styles.profileImageOriginal}
                                source={require('../../assets/images/profileImagePlaceholder.png')}
                            />}
                        </TouchableOpacity>
                        {profile_imageError ? <Text style={{ color: 'red' }}>{profile_imageError}</Text> : null}

                        <View style={styles.buttons}>

                            <TouchableOpacity
                                style={styles.createButton}
                                onPress={() => {
                                    router.push({
                                        pathname: '/(tabs)'
                                    })
                                }}
                            >
                                <Text style={styles.createButtonText}>
                                    Cancelar
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.loginButton}
                                onPress={() => handleCreateAccount(email, password, name, username, profile_image, background_image)}>
                                <Text style={styles.loginButtonText}>
                                    Criar uma conta
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
        //justifyContent: 'center',
        marginTop: 10
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
        flex: 1,
        alignItems: 'center'
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
    modalImage: {
        width: 200,
        height: 100,
        resizeMode: 'contain'
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: '#45B3AF',
    },
    profileImageOriginal: {
        width: 100,
        height: 100,
        //borderRadius: 50,
        //borderWidth: 3,
        //borderColor: '#45B3AF',
    },
});