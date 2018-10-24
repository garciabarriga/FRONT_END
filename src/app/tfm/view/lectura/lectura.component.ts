// Component: Permite importar el decorador del componente
// OnInit: Permite que esta interfaz se inicialice una vez que Angular haya arrancado
import { Component, OnInit } from '@angular/core';
// Permite que los métodos definidos en la clase LecturasService se puedan usar en el código
import { LecturasService } from '../../services/lecturas.service';
// Permite que la clase Observable de la librería Reactive Extensions For JavaScript se pueda usar en el código
import { Observable } from 'rxjs';
// Permite que la clase UIChart se pueda usar en el código y que se haga referencia a propiedades establecidas en los gráficos
import { UIChart } from '../../../../../node_modules/primeng/chart';
//const IntroJs = require('../../../../../node_modules/intro.js');


@Component({
  selector: 'app-lectura', // Se define el selector
  templateUrl: './lectura.component.html', // Se especifica el archivo de plantilla
  styleUrls: ['./lectura.component.css'] // Se especifica el archivo de estilo
})
export class LecturaComponent implements OnInit { // Se define la clase LecturaComponent que implementará la interfaz OnInit
  // Se especifica el constructor de la clase que tendrá como parámetro de entrada el servicio de Lecturas importado anteriormente
  constructor(private servicio: LecturasService) { }

  lecturas: any = { // Se declara la propiedad lecturas sin ningún tipo específico
    labels: [], // Se define el array labels
    datasets: [] // Se define el array datasets
  };
  public loaded = false;

  dati: Date = new Date(); // Se especifica la propiedad de fecha incial como una fecha
  datf: Date = new Date(); // Se especifica la propiedad de fecha final como una fecha
  lecturasBD: any = null; // Se declara la propiedad lecturasBD sin ningún tipo específico y con valor nulo
  usuario: any = {}; // Se declara la propiedad usuario sin ningún tipo específico y se inicializa como un objeto vacío
  cols: any = []; // Se declara la propiedad cols sin ningún tipo específico y se inicializa como un arreglo vacío
  cols1: any = []; // Se declara la propiedad cols1 sin ningún tipo específico y se inicializa como un arreglo vacío
  promedios: any = []; // Se declara la propiedad promedios sin ningún tipo específico y se inicializa como un arreglo vacío
  report = false; // Se incializa la propiedad report
  // Se declara la propiedad lecturasSeleccionadas sin ningún tipo específico y se inicializa como un arreglo vacío
  lecturasSeleccionadas: any = [];
  data: any = []; // Se declara la propiedad data sin ningún tipo específico y se inicializa como un arreglo vacío
  ngOnInit() { // Se define el método ngOnInit
    this.dati = new Date('2018-07-27'); // Se inicializa la propiedad de fecha inicial
    this.datf = new Date('2018-07-28'); // Se inicializa la propiedad de fecha final
    // En la propiedad usuario se asigna el ítem usuario almacenado en la sesión del navegador web pero en formato JSON
    this.usuario = JSON.parse(sessionStorage.getItem('usuario'));
    setTimeout(this.obtenerLecturas(null), 10); // Se llama al método obtener lecturas cada 10 ms
    this.cols = [ // Se inicializa la propiedad cols
      { header: 'Conversión analógica-digital', field: 'adc' },
      { header: 'Detección de CO', field: 'estado' },
      { header: 'Concentración en ppm de CO', field: 'ppm' },
      { header: 'Voltaje de salida', field: 'voltaje' },
      { header: 'Concentración en mg/m3 de CO', field: 'mgm3' },
      { header: 'Hora', field: 'hora' }
    ];
    this.cols1 = [ // Se inicializa la propiedad cols1
      { header: 'Magnitud', field: 'magnitud' },
      { header: 'Promedio', field: 'promedio' },
      { header: 'Maximo', field: 'maximo' },
      { header: 'Minimo', field: 'minimo' }
    ];

    //------------------------------------------------------\

  }

  startTour() {
    console.log('Starting tour');
/*
    const intro = IntroJs.introJs();
    // Start tutorial
    intro.start();/*/
  }
  obtenerLecturas(chart: UIChart) { // Se define el método para obtener las lecturas que tiene como entrada un gráfico
    this.servicio.obtenerLecturasUsuario( // Se llama al método obtenerLecturasUsuario definido en el servicio de Lecturas
      this.usuario.codigo, // Se pasa el código del usuario
      this.dati.toISOString(), // Se pasa la fecha inicial y final
      this.datf.toISOString()).subscribe(
        (resp: any) => {
          this.lecturasBD = resp; // En la propiedad lecturas BD se asigna la respuesta y se obtiene la tabla de lecturas
          this.construirData(); // Se llama al método construirData y se grafican las lecturas
          this.calc(resp); // Se llama al método cal pasándole como entrada la respuesta obtenida.
          // Luego se obtiene la tabla y gráfico de los valores máximos, mínimos y promedios.
          if (chart) { // Si se está mostrando el gráfico
            setTimeout(() => {
              chart.refresh(); // Se actualiza cada 100 ms
            }, 100);
          }
        });
  }
  calc(resp) { // Se define el método calc que tiene como entrada una respuesta
    const temp = []; // Se define el arreglo temp
    for (let index = 0; index < resp.length; index++) { // Se recorre la respuesta y se añaden los arreglos en temp
      temp.push(resp[index]);
    }
    const ppm = temp.map((x) => temp[0] ? x.ppm : []); // Se asigna en ppm el array ppm de temp en el caso de tener al menos un dato,
    // sino se asigna el array vacío
    const adc = temp.map((x) => temp[0] ? x.adc : []); // Se asigna en adc el array adc de temp
    const estado = temp.map((x) => temp[0] ? x.estado : []); // Se asigna en estado el array estado de temp
    const voltaje = temp.map((x) => temp[0] ? x.voltaje : []); // Se asigna en voltaje el array voltaje de temp
    const mgm3 = temp.map((x) => temp[0] ? x.mgm3 : []); // Se asigna en mgm3 el array mgm3 de temp
    this.obtenerData(ppm, adc, voltaje, mgm3, estado); // Se llama al método obtenerData con los arrays obtenidos anteriormente
  }
  obtenerData(ppm, adc, voltaje, mgm3, estado) { // Se define el método obtenerData para mostrar los datos en la tabla
    //  y en el gráfico de valores máx, mín y prom
    let i = 0; // Se inicializa i
    const temp_data = []; // Se definen los arreglos a utilizar
    const temp_dataMax = [];
    const temp_dataMin = [];
    let temp_dataProm = [];
    const n = ppm.length; // Se define la longitud del array ppm
    while (i < 5) {
      temp_data.push(0);
      i++;
    }

    temp_dataMax[0] = this.obtenerMaximo(ppm); // En temp_dataMax se obtienen los valores máximos para cada parámetro
    temp_dataMax[1] = this.obtenerMaximo(adc);
    temp_dataMax[2] = this.obtenerMaximo(voltaje);
    temp_dataMax[3] = this.obtenerMaximo(mgm3);
    temp_dataMax[4] = this.obtenerMaximo(estado);

    temp_dataMin[0] = this.obtenerMinimo(ppm); // En temp_dataMin se obtienen los valores mínimos para cada parámetro
    temp_dataMin[1] = this.obtenerMinimo(adc);
    temp_dataMin[2] = this.obtenerMinimo(voltaje);
    temp_dataMin[3] = this.obtenerMinimo(mgm3);
    temp_dataMin[4] = this.obtenerMinimo(estado);

    for (let j = 0; j < n; j++) {
      temp_data[0] += ppm[j]; // En temp_data se obtienen los valores para cada parámetro
      temp_data[1] += adc[j];
      temp_data[2] += voltaje[j];
      temp_data[3] += mgm3[j];
      temp_data[4] += estado[j];
    }
    temp_dataProm = temp_data.map((x) => (x / n).toPrecision(3)); // Se obtienen los valores promedios

    const prom: any = [ // Se define el arreglo prom con todas los campos necesarios para cada parámetro
      {
        magnitud: 'PPM',
        promedio: temp_dataProm[0],
        maximo: temp_dataMax[0],
        minimo: temp_dataMin[0]
      },
      {
        magnitud: 'ADC',
        promedio: temp_dataProm[1],
        maximo: temp_dataMax[1],
        minimo: temp_dataMin[1]
      },
      {
        magnitud: 'VOLTAJE',
        promedio: temp_dataProm[2],
        maximo: temp_dataMax[2],
        minimo: temp_dataMin[2]
      },
      {
        magnitud: 'MGM3',
        promedio: temp_dataProm[3],
        maximo: temp_dataMax[3],
        minimo: temp_dataMin[3]
      },
      {
        magnitud: 'ESTADO',
        promedio: temp_dataProm[4],
        maximo: temp_dataMax[4],
        minimo: temp_dataMin[4]
      }
    ];
    this.data = prom; // Se asigna en data el array prom y ya se tiene lista la tabla

    this.promedios = { // Se define el arreglo promedios para poder graficar los valores de cada parámetro
      labels: ['PPM', 'ADC', 'VOLTAJE', 'MGM3', 'ESTADO'],
      datasets: [
        {
          label: 'Promedios',
          backgroundColor: '#42A5F5',
          borderColor: '#1E88E5',
          data: temp_dataProm
        },
        {
          label: 'Maximo',
          backgroundColor: '#f2491f',
          borderColor: '#1E88E5',
          data: temp_dataMax
        },
        {
          label: 'Minimo',
          backgroundColor: '#def44e',
          borderColor: '#1E88E5',
          data: temp_dataMin
        }
      ]
    };
  }
  obtenerMaximo(arr) { // Se define el método obtenerMaximo que tiene como entrada un arreglo
    return Math.max.apply(null, arr); // Se devuelve el valor máximo
  }
  obtenerMinimo(arr) { // Se define el método obtenerMinimo que tiene como entrada un arreglo
    return Math.min.apply(null, arr); // Se devuelve el valor mínimo
  }
  construirData() { // Se llama al método construirData que permite graficar las lecturas
    const temp = []; // Se define el arreglo temp
    // Se realiza un barrido de las lecturas de la BD y se añaden los arreglos en temp
    for (let index = 0; index < this.lecturasBD.length; index++) {
      temp.push(this.lecturasBD[index]);
    }
    console.log(temp);
    this.lecturas.labels = temp.map((x) => temp[0] ? x.hora : []); // Se obtiene el array hora de temp y se asigna en labels de lecturas
    // en el caso de tener al menos un dato sino se asigna el array vacío
    const ppm = temp.map((x) => temp[0] ? x.ppm : []); // Se asigna en ppm el array ppm de temp
    const adc = temp.map((x) => temp[0] ? x.adc : []); // Se asigna en adc el array adc de temp
    const estado = temp.map((x) => temp[0] ? x.estado : []); // Se asigna en estado el array estado de temp
    const voltaje = temp.map((x) => temp[0] ? x.voltaje : []); // Se asigna en voltaje el array voltaje de temp
    const mgm3 = temp.map((x) => temp[0] ? x.mgm3 : []); // Se asigna en mgm3 el array mgm3 de temp
    this.lecturas.datasets = []; // Se resetea el datasets de lectura
    this.lecturas.datasets.push( // Se crean los campos necesarios para poder graficar los valores de cada parámetros de las lecturas
      {
        label: 'Conversión analógica-digital',
        data: adc,
        fill: false,
        borderColor: '#412200'
      },
      {
        label: 'Detección de CO',
        data: estado,
        fill: false,
        borderColor: '#e02365'
      },
      {
        label: 'Concentración en ppm de CO',
        data: ppm,
        fill: false,
        borderColor: '#212b0'
      },
      {
        label: 'Voltaje de salida',
        data: voltaje,
        fill: false,
        borderColor: '#1161a0'
      },
      {
        label: 'Concentración en mg/m3 de CO',
        data: mgm3,
        fill: false,
        borderColor: '#3152b0'
      }
    );
  }
}
