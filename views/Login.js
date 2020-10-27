import React, {useState} from 'react';
import {View, AsyncStorage} from 'react-native';
import {
  Container,
  Button,
  Text,
  H1,
  Input,
  Form,
  Item,
  Toast,
} from 'native-base';
import {useNavigation} from '@react-navigation/native';
import globalStyles from '../styles/global';

import {gql, useMutation} from '@apollo/client';

const AUTENTICAR_USUARIO = gql`
  mutation autenticarUsuario($input: AutenticarInput) {
    autenticarUsuario(input: $input) {
      token
    }
  }
`;
const Login = () => {
  //State del formulario
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [mensaje, setMensaje] = useState(null);
  //React navigation
  const navigation = useNavigation();

  //Mutación de apollo
  const [autenticarUsuario] = useMutation(AUTENTICAR_USUARIO);

  //Cuando el usuario presiona en iniciar sesión
  const handleSubmit = async () => {
    if (email === '' || password === '') {
      setMensaje('Todos los campos son obligatorios');
      return;
    }

    try {
      //Autenticar al usuario
      const {data} = await autenticarUsuario({
        variables: {
          input: {
            email,
            password
          }
        }
      });

      const {token} = data.autenticarUsuario;
      await AsyncStorage.setItem('token', token);

      navigation.navigate('Proyectos');
    } catch (error) {
      //Si hay un error mostrarlo
      setMensaje(error.message.replace('GraphQL error: ', ''));
    }
  };

  //Muestra un mensaje toast
  const mostrarAlerta = () => {
    Toast.show({
      text: mensaje,
      buttonText: 'Ok',
      duration: 500,
    });
  };

  return (
    <Container style={[globalStyles.contenedor, {backgroundColor: '#e84347'}]}>
      <View style={globalStyles.contenido}>
        <H1 style={globalStyles.titulo}>UpTask</H1>
        <Form>
          <Item inlineLabel last style={globalStyles.input}>
            <Input
              placeholder="Email"
              autoCompleteType="email"
              keyboardType="email-address"
              onChangeText={(text) => setEmail(text)}
            />
          </Item>
          <Item inlineLabel last style={globalStyles.input}>
            <Input
              secureTextEntry={true}
              placeholder="Password"
              onChangeText={(text) => setPassword(text)}
            />
          </Item>
        </Form>
        <Button
          square
          block
          style={globalStyles.boton}
          onPress={() => handleSubmit()}>
          <Text style={globalStyles.botonTexto}>Iniciar Sesión</Text>
        </Button>

        <Text
          onPress={() => navigation.navigate('CrearCuenta')}
          style={globalStyles.enlace}>
          Crear Cuenta
        </Text>
        {mensaje && mostrarAlerta()}
      </View>
    </Container>
  );
};

export default Login;
