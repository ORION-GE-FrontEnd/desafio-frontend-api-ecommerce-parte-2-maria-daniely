import { gql, ApolloServer } from "apollo-server";

const produtos = [
    {
        id: 1,
        nome: "Notebook",
        valor: 1700.00
    },
    {
        id: 2,
        nome: "Mouse",
        valor: 80.00
    }
]

const usuarios = [
     {
        id: 1,
        nome: 'Maria de Fátima',
        salario: '1500.00',
        ativo: true,
        idade: 24
    },
    
    {
        id: 2,
        nome: 'João',
        salario: '1200.00',
        ativo: false,
        idade: 20
    }
]

const resolvers = {
    Query: {
        usuarios() {
            return usuarios;
        },
        produtos() {
            return produtos;
        }
    }
};

const typeDefs = gql`
    type Produto {
        id: ID
        nome: String
        valor: Float
    }

    type Usuario {
        idade: Int
        salario: Float
        nome: String
        ativo: Boolean
        id: ID 
    }
    type Query {
        usuarios: [Usuario]
        produtos: [Produto]
    }
`;
const server = new ApolloServer({
    typeDefs,
    resolvers
})

server.listen()