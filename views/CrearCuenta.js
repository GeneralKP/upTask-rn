import React, {useState} from 'react';
import {View} from 'react-native';
import {Container,Button,Text,H1,Input,Form,Item,Toast} from 'native-base';
import {useNavigation} from '@react-navigation/native';
import globalStyles from '../styles/global';

// Apollo
import { gql, useMutation } from '@apollo/client';

const NUEVACUENTA = gql`
mutation crearUsuario($input: UsuarioInput){
  crearUsuario(input: $input)
}
`;

const CrearCuenta = () => {
  //State del formulario
  const [nombre, setNombre] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const [mensaje, setMensaje] = useState(null);

  //React navigation
  const navigation = useNavigation();

  //Mutation de apollo
  const [ crearUsuario ] = useMutation(NUEVACUENTA);

  //Cuando el usuario presiona en crear cuenta
  const handleSubmit = async() => {
    //Validar
    if (nombre.trim() === '' || email.trim() === '' || password.trim() === '') {
      //Mostrar un error

      setMensaje('Todos los campos son obligatorios');
      return;
    }
    //Password al menos 6 caracteres
    if (password.length < 6) {
      setMensaje('El password debe ser de al menos 6 caracteres');
      return;
    }

    //Guardar el usuario
    try {
      const {data} = await crearUsuario({
        variables: {
          input: {
            nombre,
            email,
            password
          }
        }
      });
      setMensaje(data.crearUsuario);
      navigation.navigate('Login');
    } catch (error) {
      setMensaje(error.message.replace('GraphQL error: ', ''))
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
              placeholder="Nombre"
              onChangeText={(text) => setNombre(text)}
              value={nombre}
              />
          </Item>
          <Item inlineLabel last style={globalStyles.input}>
            <Input
              placeholder="Email"
              onChangeText={(text) => setEmail(text)}
              value={email}
              keyboardType='email-address'
              />
          </Item>
          <Item inlineLabel last style={globalStyles.input}>
            <Input
              secureTextEntry={true}
              placeholder="Password"
              onChangeText={(text) => setPassword(text)}
              value={password}
            />
          </Item>
        </Form>
        <Button
          square
          block
          style={globalStyles.boton}
          onPress={() => handleSubmit()}>
          <Text style={globalStyles.botonTexto}>Crear cuenta</Text>
        </Button>
        {mensaje && mostrarAlerta()}
      </View>
    </Container>
  );
};

export default CrearCuenta;
