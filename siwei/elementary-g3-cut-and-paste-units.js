window.AOSHU_ELEMENTARY_DEEP_UNITS = Object.assign(
  window.AOSHU_ELEMENTARY_DEEP_UNITS || {},
  {
    'roadmap:g3-14': {
      label: '本轮补深 · 三年级第 14 讲',
      roadmapTitle: '图形的剪拼',
      roadmapGroup: '图形与计数',
      title: '把剪法画出来：每块面积都在',
      scope: '本轮把原例题具体化为沿方格边界把长方形剪成两块，再整块平移重拼；每块都恰好用一次，拼接没有重叠或空隙。',
      goal: '用剪开、平移和拼接把陌生图形变成熟悉图形。',
      idea: '只把图形的部分搬动或重新拼在一起，不会凭空多出或少掉面积；每块都要刚好用一次。',
      example: {
        question: '把一个长 8、宽 3 的长方形剪成几块再重新拼合。',
        verification: {
          kind: 'cut-and-paste-grid-area',
          source: {width:8,height:3},
          pieces: [{label:'A',width:4,height:3,count:1},{label:'B',width:4,height:3,count:1}],
          target: {width:4,height:6},
          layout: [['A','A','A','A'],['A','A','A','A'],['A','A','A','A'],['B','B','B','B'],['B','B','B','B'],['B','B','B','B']],
          expectedArea: 24
        },
        steps: [
          '原图面积是 8×3=24 平方单位。',
          '剪开的每一块面积仍在，拼回去时没有重叠也没有空缺。',
          '新图形的总面积仍是 24 平方单位。',
          '现在把剪法说具体：沿第 4 列右侧的格线剪，得到 A、B 两个 4×3 长方形；每块有 4×3=12 个方格。',
          '把 B 整块移到 A 下方，拼成 4×6 长方形。两块各用一次，边对齐，没有重叠也没有空缺。',
          '拼后面积是 4×6=24 平方单位，和原来的 8×3=24 相同；外形改变了，面积没有改变。'
        ]
      },
      methodCard: {
        title: '剪拼四步：算原图、分块、重排、核对',
        formula: '总面积 = 每块面积相加（无重叠、无空隙）',
        when: '题目说明每一块都完整保留并且全部使用时。',
        steps: ['先写出原图面积：长×宽', '在方格边上标出明确的剪线，算出每一块', '按题目把每块整块搬动；每块只放一次', '逐格检查没有重叠和空隙，再把各块面积相加'],
        check: '不要把外面的长方形框面积当成不规则拼图的面积；先看每块有没有重叠、遗漏或空隙。'
      },
      diagram: {
        caption: '中间剪开，两块都用一次；B移到A下方',
        text: '原图8×3：中间剪\nA A A A | B B B B\nA A A A | B B B B\nA A A A | B B B B\nA、B各4×3\n拼后4×6：\nA A A A\nA A A A\nA A A A\nB B B B\nB B B B\nB B B B\n格数：12+12=24'
      },
      concepts: [
        {title:'1. 剪线要说清楚',text:'8×3 的长方形沿中间竖边界剪开，左、右各是 4×3。说清楚剪在哪里，别人才能照着分出同样的两块。'},
        {title:'2. 整块搬动不改每块面积',text:'A、B 各有 4×3=12 个单位方格。把 B 平移到 A 下方，只改变位置，不会让 B 多一格或少一格。'},
        {title:'3. 每块恰好用一次才能拼完整',text:'逐块检查：没有把一块丢下，也没有把同一块算两次；拼接处没有重叠，也没有留出空洞。这样各块面积相加才等于新图形面积。'},
        {title:'4. 反例：重叠一格要减一次',text:'练习中两块各 6 格，若拼接时有 1 格重叠，实际覆盖的不同格是 6+6−1=11 格，不是 12 格。若有空隙，也不能把空隙包进外框后当成图形面积。'}
      ],
      practices: [
        {
          level:'起步 · 保留原自测：4×5',
          question:'把一个长 4、宽 5 的长方形剪成几块，再把每一块都恰好用一次、不重叠、不留空地拼成别的形状，面积是多少？',
          answers:['20','20平方单位'],
          verification:{kind:'area-preservation',width:4,height:5,expectedArea:20,allPiecesUsed:true,noOverlap:true,noGaps:true},
          hint:'先求原长方形的面积，剪拼不会改变总面积。',
          wrongFeedback:'先不要用新图形的外框猜面积：原长方形是 4×5=20。题目还保证每块都用一次、不重叠、不留空，所以没有丢格或重格。',
          correctFeedback:'答对了：4×5=20 平方单位；题设保证每块都完整用上。',
          explanation:'原长方形面积是 4×5=20 平方单位；把全部小块不重叠、不留空地拼好，面积总和仍是 20 平方单位。再核对：每块都只用一次，没有遗漏或重复。'
        },
        {
          level:'练习 · 两块重排成正方形',
          question:'一个 8×2 方格长方形沿中间竖边界剪成两个 4×2 小长方形。把一块放在另一块下面，拼成 4×4 正方形，拼后面积是多少？',
          answers:['16','16平方单位'],
          verification:{kind:'cut-and-paste-grid-area',source:{width:8,height:2},pieces:[{label:'A',width:4,height:2,count:1},{label:'B',width:4,height:2,count:1}],target:{width:4,height:4},layout:[['A','A','A','A'],['A','A','A','A'],['B','B','B','B'],['B','B','B','B']],expectedArea:16},
          hint:'先算每块 4×2 有几格，再把两块都加上；不要因为外形变成正方形就改掉每块的面积。',
          wrongFeedback:'原图 8×2=16；A、B 各有 4×2=8 格，两块都用上时共 16 格。新图 4×4 也正好是 16 格。',
          correctFeedback:'答对了：两块各 8 格，合起来 16 格；新图 4×4 也是 16 格。',
          explanation:'A、B 两块各 4×2=8 格，合计 8+8=16 平方单位；拼出的正方形是 4×4=16 平方单位。'
        },
        {
          level:'迁移 · 找出重叠造成的变化',
          question:'A、B 两块各 3×2，共 12 格。重拼时有 1 个单位格重叠；拼好的图形实际占多少个不同单位格？',
          answers:['11','11格','11个'],
          verification:{kind:'overlap-area',pieceAreas:[6,6],overlap:1,expectedArea:11},
          hint:'先把两块面积相加；重叠的那 1 格被算了两次，要减去多算的一次。',
          wrongFeedback:'重叠格不能算两遍：6+6 后，减去重复的 1 格，得到 11 个不同单位格。',
          correctFeedback:'对：6+6−1=11 个不同单位格；重叠不是新面积。',
          explanation:'两块面积和为 6+6=12 格，其中一格被两块都占到，重复计算了一次，所以实际覆盖的不同单位格是 12−1=11 格。'
        }
      ],
      review: [
        {question:'怎样才能说明剪拼后面积没有变？',answer:'每块整块搬动、恰好用一次，而且不重叠、不留空；各块面积相加仍等于原图面积。'},
        {question:'8×3 为什么能拼成 4×6？',answer:'原图沿中间剪成两个 4×3 块，各有 12 格；把一块移到另一块下方，形成 4×6，共 24 格。'},
        {question:'两块各 6 格却重叠 1 格，实际为什么只有 11 格？',answer:'相加时重叠格被算了两遍，实际只覆盖一个单位格，所以要减去重复的那 1 格。'}
      ]
    }
  }
);
