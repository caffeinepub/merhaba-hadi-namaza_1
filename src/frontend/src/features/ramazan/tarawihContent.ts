export interface TarawihContent {
  title: string;
  sections: {
    heading: string;
    content: string[];
  }[];
}

export const tarawihContent: TarawihContent = {
  title: "Teravih Namazı",
  sections: [
    {
      heading: "Kaç Rekat?",
      content: [
        "Teravih namazı 20 rekattır ve ikişer ikişer kılınır.",
        "Her dört rekattan sonra kısa bir mola verilir ve bu molalara 'terviha' denir.",
        "Teravih namazı cemaatle kılınması müstehap olan bir namazdır."
      ]
    },
    {
      heading: "Nasıl Kılınır?",
      content: [
        "Yatsı namazından sonra kılınır.",
        "İkişer rekat olarak toplam 10 selam ile tamamlanır.",
        "Her iki rekatta bir selam verilir.",
        "Teravih namazında Kur'an-ı Kerim'den uzunca sureler okunması sünnettir.",
        "İmam, cemaatle birlikte teravihi yönetir ve Kur'an'dan okur."
      ]
    },
    {
      heading: "Ramazan Boyunca Notlar",
      content: [
        "Teravih namazında Ramazan ayı boyunca Kur'an-ı Kerim hatmedilir.",
        "Her gece yaklaşık bir cüz okunur.",
        "Teravih namazı kılmak büyük sevaptır ve Ramazan'ın bereketinden yararlanmanın önemli bir yoludur.",
        "Teravih namazını evde de kılabilirsiniz, ancak cemaatle kılmak daha faziletlidir.",
        "Kadir Gecesi'nde teravih namazına özel önem verilir."
      ]
    }
  ]
};
