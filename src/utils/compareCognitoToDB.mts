import AWS from "aws-sdk";
import { createUser, updateUser } from "../services/UserService.mjs";
import dotenv from "dotenv";

dotenv.config();

export const compareCognitoToDB = async (user: any, email: string, name: string) => {
  const cognito = new AWS.CognitoIdentityServiceProvider();
  const userPoolId = process.env.COGNITO_USER_POOL_ID!;

  try {
    // Se o usuário não existir no banco, cria um novo registro
    if (!user) {
      user = await createUser(name, email, "user");  // Definindo 'user' como padrão, mas pode mudar logo abaixo.
    } else {
      // Se o usuário existir no banco, atualiza no banco com dados do Cognito
      const cognitoUser = await cognito.adminGetUser({
        UserPoolId: userPoolId,
        Username: email,
      }).promise();

      if (cognitoUser.UserAttributes) {
        // Atualizando o nome do usuário com base no Cognito
        const nameAttribute = cognitoUser.UserAttributes.find(attr => attr.Name === 'name');
        if (nameAttribute && nameAttribute.Value !== user.name) {
          user.name = nameAttribute.Value;
        }
        // Verificando o grupo do usuário no Cognito (admin ou user)
        const groupsResponse = await cognito.adminListGroupsForUser({
          UserPoolId: userPoolId,
          Username: email,
        }).promise();

        // Verifica se o usuário está no grupo "admin", se sim, atualiza o papel do usuário
        const isAdmin = groupsResponse.Groups?.some(group => group.GroupName === "admin");

        // Atualizando o papel do usuário no banco com base nos grupos do Cognito
        user.role = isAdmin ? "admin" : "user";
      }
      await updateUser(user); // Atualiza o usuário no banco com os dados mais recentes do Cognito
    }

    return user; // Retorna o usuário atualizado ou recém-criado
  } catch (error) {
    console.error('Erro ao comparar Cognito com DB:', error);
    throw new Error('Erro ao sincronizar Cognito com banco de dados');
  }
};
