const {io} = require('../index');
const Band = require('../models/band');
const Bands = require('../models/bands');

const bands = new Bands();

bands.addBand(new Band('Ghost'));
bands.addBand(new Band('Metallica'));
bands.addBand(new Band('Guns & Roses'));
bands.addBand(new Band('Bon Jovi'));


// Mensajes de Sockets
io.on('connection', client => {
    console.log('Cliente conectado');

    client.emit('active-bands', bands.getBands());

    client.on('disconnect', () => { 
        console.log('Cliente desconectado');
    });
    client.on('mensaje', (payload)=>{
        console.log('Mensaje ', payload);

        io.emit('mensaje', {admin: 'Nuevo mensaje'});
    });

    client.on('emitir-mensaje', (payload) =>{
        console.log(payload);
        //io.emit('nuevo-mensaje', payload); //emite a todos
        client.broadcast.emit('emitir-mensaje', payload); //emite a todos menos al que lo emite
    });

    // Escuchar votar banda
    client.on('vote-band', function(payload){
        bands.voteBand(payload.id);
        io.emit('active-bands', bands.getBands());
    });

    // Escuchar agregar banda
    client.on('add-band', function(payload){
        const band = new Band (payload.name);
        bands.addBand(band);
        io.emit('active-bands', bands.getBands());
    });

    // Escuchar borrar banda
    client.on('delete-band', function(payload){
        bands.deleteBand(payload.id);
        io.emit('active-bands', bands.getBands());
    });




  });
