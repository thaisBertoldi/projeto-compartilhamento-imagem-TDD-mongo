let app = require("../src/app");
let supertest = require("supertest");
let request = supertest(app);

let mainUser = {
  name: "Thais",
  email: "thais@thais.com",
  password: "123456"
}

beforeAll(() => {
  return request.post('/user')
  .send(mainUser)
  .then(res => {})
  .catch(err => { console.log( err )});
});

afterAll(() =>{
  return request.delete(`/user/${mainUser.email}`)
  .then(res => {})
  .catch(err => { console.log(err) });
});

describe("Cadastro de usuário", () => {

  test("Deve cadastrar um usuário com sucesso", () => {
    let email = `${Date.now()}@teste.com`;
    let user = {
      name: "Thais",
      email,
      password: "123456",
    };

    return request
      .post("/user")
      .send(user)
      .then((res) => {
        expect(res.statusCode).toEqual(200);
        expect(res.body.email).toEqual(email);
      })
      .catch((err) => {
        fail(err);
      });
  });

  test("Deve impedir que um usuário se cadastre com os dados vazios", () => {
    let user = {
      name: "",
      email: "",
      password: "",
    };
    return request
      .post("/user")
      .send(user)
      .then((res) => {
        expect(res.statusCode).toEqual(400);
      })
      .catch((err) => {
        fail(err);
      });
  });

  test('Deve impedir que um usuário se cadastre com um email repetido', () => {
    let email = `${Date.now()}@teste.com`;
    let user = {
      name: "Thais",
      email,
      password: "123456",
    };

    return request
      .post("/user")
      .send(user)
      .then((res) => {
        expect(res.statusCode).toEqual(200);
        expect(res.body.email).toEqual(email);
        return request.post('/user')
        .send(user)
        .then(res => {
          expect(res.statusCode).toEqual(400);
          expect(res.body.error).toEqual('Email já cadastrado');
        }).catch(err => {
          fail(err);
        });
      }).catch((err) => {
        fail(err);
      });
  });

});

describe("Autenticacao", () => {

  test("Deve retornar um token quando logar", () => {
    return request.post("/auth")
    .send({
      email: mainUser.email,
      password: mainUser.password
    })
    .then(res => {
      expect(res.statusCode).toEqual(200);
      expect(res.body.token).toBeDefined();
    })
    .catch(err => {
      fail(err);
    });
  });

  test("Deve impedir um usuario não cadastrado de se logar", () => {
    return request.post("/auth")
    .send({
      email: "qualquercoisa@teste.com",
      password: "qualquersenhatbm"
    })
    .then(res => {
      expect(res.statusCode).toEqual(403);
      expect(res.body.errors.email).toEqual("Email não cadastrado");
    })
    .catch(err => {
      fail(err);
    });
  });

  test("Deve impedir que um usuário se logue com a senha errada", () => {
    return request.post("/auth")
    .send({
      email: mainUser.email,
      password: "qualquersenhatbm"
    })
    .then(res => {
      expect(res.statusCode).toEqual(403);
      expect(res.body.errors.password).toEqual("Senha incorreta");
    })
    .catch(err => {
      fail(err);
    });
  });
});
