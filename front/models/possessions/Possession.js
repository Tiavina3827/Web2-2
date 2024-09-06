
export default class Possession {
  constructor(possesseur, libelle, valeur, dateDebut, dateFin, tauxAmortissement) {
    this.possesseur = possesseur;
    this.libelle = libelle;
    this.valeur = valeur;
    this.dateDebut = dateDebut;
    this.dateFin = dateFin;
    this.tauxAmortissement = tauxAmortissement;
  }

  getValeur(date) {
    return this.getValeurApresAmortissement(date);
  }

  getValeurApresAmortissement(dateActuelle) {
    if (dateActuelle < this.dateDebut) {
      return 0;
    }
    const differenceDate = {
      year: dateActuelle.getFullYear() - this.dateDebut.getFullYear(),
      month: dateActuelle.getMonth() - this.dateDebut.getMonth(),
      day: dateActuelle.getDate() - this.dateDebut.getDate(),
    };
  
    var raison = differenceDate.year + differenceDate.month / 12 + differenceDate.day / 365;

    const result = this.valeur - this.valeur * (raison * this.tauxAmortissement / 100);
    return result;
  }

  toJSON() {
    return {
      possesseur: this.possesseur,
      libelle: this.libelle,
      valeur: this.valeur,
      dateDebut: this.dateDebut.toISOString(),
      dateFin: this.dateFin.toISOString(),
      tauxAmortissement: this.tauxAmortissement
    }
  }

  async save() {
    try {
      await axios.post('http://localhost:3001/add-possession', this.toJSON());
      console.log('Possession sauvegardée!');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  }
}
