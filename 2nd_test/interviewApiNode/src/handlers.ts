import { FastifyRequest, FastifyReply } from "fastify";
// import { PokemonWithStats } from "models/PokemonWithStats";

export async function getPokemonByName(
  request: FastifyRequest,
  reply: FastifyReply
) {
  var urlApiPokeman = `https://pokeapi.co/api/v2/pokemon/`;
  reply.headers["Accept"] = "application/json";

  var name: string = request.params["name"];

  name != null && name.trim() != ""
    ? (urlApiPokeman = urlApiPokeman + name)
    : (urlApiPokeman = urlApiPokeman + "?offset=20" + "&limit=20");

  var response: any = "";

  const axios = require("axios").default;
  await axios
    .get(urlApiPokeman)
    .then(function (res) {
      //? handle response
      response = res.data;
    })
    .catch(function (error) {
      //? handle error
      console.log("error => ", error);
      reply.code(404).send({
        message: `name (${name}) is undefined !!`,
      });
    });

  var data = await computeResponse(response, reply);

  console.log("\n\n\n Done ...");

  reply.send(data);
  return reply;
}

export const computeResponse = async (response: any, reply: FastifyReply) => {
  const resp = response as any;
  //? reducee type of current pokemon
  let types = resp.types.map((type) => type.type.url);

  let pokemonTypes = [];
  const axios = require("axios").default;

  //? Get data all pokemon of types
  for (let i = 0; i < types.length; i++) {
    const typeUrl = types[i];
    await axios
      .get(typeUrl)
      .then(function (res) {
        //? handle response
        pokemonTypes = [...pokemonTypes, ...res.data.pokemon];
      })
      .catch(function (error) {
        //? handle error
        console.log("error => get pokemonTypes");
      });
  }

  if (pokemonTypes == undefined) throw pokemonTypes;

  //! lorsque je n'est pas lattrebuit stats => j'ai fait des appel vers api pour recupire data de pokemon

  //? Get data of pokemon
  var pokemonTypesWithStats = [];
  for (let index = 0; index < pokemonTypes.length /*- 185 */; index++) {
    const pokemonObj = pokemonTypes[index];
    await axios
      .get(pokemonObj.pokemon.url)
      .then(function (res) {
        //? handle response
        pokemonTypesWithStats.push(res.data);
      })
      .catch(function (error) {
        //? handle error
        console.log("error => get pokemonTypesWithStats ");
      });
  }

  //? get all base_stats
  response.stats.map((element) => {
    var stats = [];
    pokemonTypesWithStats.map((pok) =>
      pok.stats.map(
        (st) =>
          st.stat.name.toUpperCase() == element.stat.name.toUpperCase() &&
          stats.push(st.base_stat)
      )
    );
    //? average of base stats and add attribute averageStat too state
    if (stats) {
      let avg = stats.reduce((a, b) => a + b) / stats.length;
      element.averageStat = avg;
    } else {
      element.averageStat = 0;
    }
  });
  return response;
};
