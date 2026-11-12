window.AOSHU_ELEMENTARY_DEEP_UNITS = Object.assign(
  window.AOSHU_ELEMENTARY_DEEP_UNITS || {},
  {
    'roadmap:g3-12': {
      label: '本轮补深 · 三年级第 12 讲',
      roadmapTitle: '数线段',
      roadmapGroup: '图形与计数',
      title: '按左端点分组：线段不重不漏',
      scope: '点在同一直线上并已按从左到右排好；只统计由这些点作为端点的线段。',
      goal: '数一条直线上由多个点确定的所有线段，不重数也不漏数。',
      idea: '从每个点开始，依次连接它右边还没计过的点；五个点时分组是 4+3+2+1。每条线段只归到它较左的端点那一组。',
      example: {
        question: 'A、B、C、D、E 五点从左到右排在一条直线上。',
        verification: {kind:'line-segment-count',points:['A','B','C','D','E'],expectedSegments:10,groupCounts:[4,3,2,1]},
        steps: [
          '从 A 出发：AB、AC、AD、AE，共 4 条。',
          '从 B 出发，只数新线段：BC、BD、BE，共 3 条。',
          '从 C、D 依次得到 2 条和 1 条；合计 4+3+2+1=10 条。',
          '每条线段都有一个更靠左的端点，只会出现在那一组；所以既没有把 AB、BA 重复数，也没有漏掉长线段。'
        ]
      },
      methodCard: {
        title: '方法：先定左端点，再数右边的点',
        formula: '5个点：4+3+2+1=10条线段',
        when: '点在同一直线上，题目要数任意两个点作为端点时。',
        steps: ['先把点按从左到右排好', '从最左点连到右边每一个点', '左端点每次向右移一位，只数新线段', '把每组条数相加，并检查每条线段只有一个左端点'],
        check: '不要把 AB 和 BA 算两次；也不要只数相邻小段，AC、AD 这样的长线段也各算一条。'
      },
      diagram: {
        caption: '五个共线点；每组固定一个最左端点',
        text: 'A—B—C—D—E\nA起点：4条\nB起点：3条\nC起点：2条\nD起点：1条\n合计：10条'
      },
      concepts: [
        {title:'1. 一条线段由一对端点确定',text:'AB 和 BA 是同一条线段，只能算一次；AC 的端点不同，所以 AC 是另一条线段。'},
        {title:'2. 长线段也要数',text:'A、B、C 在同一直线上时，AB 和 BC 是相邻小段，AC 也是一条线段；只数相邻小段会漏掉 AC。'},
        {title:'3. 为什么按左端点分组不会重数',text:'AB、AC、AD、AE 都属于 A 组；BC、BD、BE 属于 B 组。任意一条线段只有一个较左的端点，因此只进一个组。'},
        {title:'4. 每组会逐渐变少',text:'五个点时，最左点右边有 4 个点；下一个点右边有 3 个；再往右依次有 2、1 个，最后一个点没有新线段。'},
        {title:'容易错：把同一条线段倒着再数',text:'固定从左往右读点名，换组时左端点只向右移动；不要把已经出现的点对倒过来重列。'}
      ],
      practices: [
        {
          level:'起步 · 保留原自测：4个点',
          question:'一条直线上有 4 个不同的点，一共能组成几条线段？',
          answers:['6','六条','6条'],
          verification:{kind:'line-segment-count',points:['A','B','C','D'],expectedSegments:6,groupCounts:[3,2,1],expectedAnswer:6},
          hint:'按从左到右的点数新线段：3+2+1。',
          wrongFeedback:'相邻小段 AB、BC、CD 只有 3 条；还要数 AC、AD、BD，合计 6 条。',
          correctFeedback:'答对了：3+2+1=6。每条线段只按它较左的端点分到一组。',
          explanation:'3+2+1=6 条。也可逐点列出全部点对，确认没有重复。具体地，从 A 出发有 AB、AC、AD 三条；从 B 出发新数 BC、BD 两条；从 C 出发有 CD 一条。'
        },
        {
          level:'练习 · 找出跨过点的长线段',
          question:'五个点从左到右排在一条直线上。不是相邻两点连成的线段有几条？',
          answers:['6','6条','六条'],
          verification:{kind:'line-segment-count',points:['A','B','C','D','E'],expectedSegments:10,adjacentSegments:4,excludeAdjacent:true,expectedAnswer:6},
          hint:'先按 4+3+2+1 算出全部线段，再减去 4 条相邻小段。',
          wrongFeedback:'五个点共有 10 条线段，其中相邻小段只有 4 条；还要把跨过一个或更多点的线段算进去。',
          correctFeedback:'对：10−4=6 条不是相邻小段的线段。',
          explanation:'全部线段是 4+3+2+1=10 条；相邻小段 AB、BC、CD、DE 共 4 条，所以其余长线段有 10−4=6 条。'
        },
        {
          level:'迁移 · 7个点',
          question:'七个点从左到右排在一条直线上，共能组成几条线段？',
          answers:['21','21条'],
          verification:{kind:'line-segment-count',points:['A','B','C','D','E','F','G'],expectedSegments:21,groupCounts:[6,5,4,3,2,1],expectedAnswer:21},
          hint:'按左端点分组：6+5+4+3+2+1。',
          wrongFeedback:'不要只数相邻的 6 段；每个点还可以连接到它右边更远的点。',
          correctFeedback:'答对：6+5+4+3+2+1=21。每对端点恰好按较左的点计一次。',
          explanation:'从最左点开始分别有 6、5、4、3、2、1 条新线段，共 21 条。'
        }
      ],
      review: [
        {question:'为什么 AB 和 BA 只能算一条？',answer:'线段由两个端点确定，端点顺序不改变它；这两个点对只计一次。'},
        {question:'按左端点分组，怎样知道不会重复？',answer:'每条线段都有唯一一个较左端点，只会进入那个点对应的一组。'},
        {question:'A、B、C 三点共线时，为什么 AC 也要数？',answer:'AC 的两个端点是 A 和 C；它跨过 B，但仍是一条不同于 AB、BC 的线段。'}
      ]
    },
    'roadmap:g3-13': {
      label: '本轮补深 · 三年级第 13 讲',
      roadmapTitle: '数图形',
      roadmapGroup: '图形与计数',
      title: '先定高度，再数每种宽度',
      scope: '只数边沿方格线的长方形；正方形也算长方形。不同大小、不同位置的图形分别计数。',
      goal: '给每个图形设一个固定的识别办法，按大小或起点分类。',
      idea: '一行三格时，先数宽 1 格、2 格、3 格，一共 3+2+1=6 个；多行时再按不同的上下边界，也就是不同高度，分组数宽度。',
      example: {
        question: '一条横向的 1×3 方格带共有 4 条竖边界线，里面一共有几个长方形？',
        verification:{kind:'grid-rectangles',rows:1,columns:3,expectedRectangles:6},
        steps: [
          '选任意两条竖边界，确定一个长方形的左右边。',
          '4 条竖线可按起点分类：左边在第 1 条时 3 种，第 2 条时 2 种，第 3 条时 1 种。',
          '合计 3+2+1=6 个；只有一组上下边界，因此不再多选。',
          '每个长方形都有唯一的左、右竖边界；按左边界从左到右分组，不会把同一个长方形算两次。'
        ]
      },
      methodCard: {
        title: '方法：固定上下边，再数左右边界',
        formula: '1行×3列：3+2+1=6；2行×2列：6+3=9',
        when: '方格图中的长方形边都沿格线，题目要数不同位置和大小的所有长方形时。',
        steps: ['先说明正方形也计作长方形', '选定一组上、下边界，固定图形高度', '在这组高度里，从左到右数每种宽度', '换另一组上、下边界继续数，最后相加'],
        check: '每个长方形由两条横边界和两条竖边界确定；边界组只对应一个长方形。不要只数小格，也不要把同一个大长方形按里面的小格重复计算。'
      },
      diagrams: [
        {caption:'原例：1行3列，只有一种高度',text:'1×3方格带\n+---+---+---+\n| 1 | 2 | 3 |\n+---+---+---+'},
        {caption:'迁移：2行2列，按高度分组',text:'2×2方格\n+---+---+\n|   |   |\n+---+---+\n|   |   |\n+---+---+'},
        {caption:'练习：2行4列；每一种高度有10种宽度',text:'2×4方格\n+---+---+---+---+\n|   |   |   |   |\n+---+---+---+---+\n|   |   |   |   |\n+---+---+---+---+'}
      ],
      concepts: [
        {title:'1. 四条边界确定一个长方形',text:'先选一条上边界和一条下边界，再选一条左边界和一条右边界。四条线围出的部分就是一个长方形；格子里没有别的斜边可选。'},
        {title:'2. 1行3列：把竖边界当作线段端点',text:'4 条竖线从左到右排列；固定最左边界时，可选 3 个右边界，再依次有 2、1 个。它和数线段的左端点分组是同一个不重不漏方法。'},
        {title:'3. 多行时先固定高度',text:'2行2列时，长方形高度有三种：只占上行、只占下行、跨两行。每种高度里都能选 3 种宽度，所以是 3+3+3=9 个。'},
        {title:'4. 每个长方形只会落进一个小组',text:'一个长方形的上、下边界固定后，高度就确定；再用左、右边界确定宽度。四条边界唯一，因此既不会重复，也不会遗漏。'},
        {title:'容易错：只数单位小格',text:'2行2列有 4 个单位小格，但还要数横跨两格、竖跨两行和整个大方格的长方形；按高度、宽度分类就能补齐。'}
      ],
      practices: [
        {
          level:'起步 · 保留原自测：1行2列',
          question:'一行两格的方格带里，有几个长方形？',
          answers:['3','三个','3个'],
          verification:{kind:'grid-rectangles',rows:1,columns:2,expectedRectangles:3},
          hint:'可以是左格、右格，也可以是两个格合起来。',
          wrongFeedback:'别只数左格和右格；两个格合起来的整条方格带也是一个长方形。',
          correctFeedback:'对：左格、右格、整条各 1 个，共 3 个。',
          explanation:'左格 1 个、右格 1 个、整条 1 个，共 3 个。'
        },
        {
          level:'练习 · 从一维扩展到两行',
          question:'两行两列的方格中（正方形也算长方形），一共有几个长方形？',
          answers:['9','9个'],
          verification:{kind:'grid-rectangles',rows:2,columns:2,expectedRectangles:9},
          hint:'先分高度：只占上行、只占下行、跨两行；每种高度都数 3 种宽度。',
          wrongFeedback:'只数 4 个小方格会漏掉大图形。高度为 1 行时有 3+3 个，高度为 2 行时还有 3 个。',
          correctFeedback:'答对了：高度为 1 行有 6 个，高度为 2 行有 3 个，共 9 个。',
          explanation:'只占上行有 3 个宽度，只占下行也有 3 个；跨两行时有 3 种宽度，合计 3+3+3=9 个。'
        },
        {
          level:'迁移 · 2行4列',
          question:'两行四列的方格中（正方形也算长方形），一共有几个长方形？',
          answers:['30','30个'],
          verification:{kind:'grid-rectangles',rows:2,columns:4,expectedRectangles:30},
          hint:'上行、下行、跨两行，共 3 种高度；固定任一种高度后，5 条竖边界可按 4+3+2+1 分组。',
          wrongFeedback:'每种高度不是只有 4 个宽度；5 条竖边界能从左边界开始数出 4+3+2+1=10 种宽度。再把 3 种高度都数上。',
          correctFeedback:'答对：3 种高度，每种 10 种宽度，共 10+10+10=30 个。',
          explanation:'高度有三种：只占上行、只占下行、跨两行。每种高度下，5 条竖边界产生 4+3+2+1=10 种宽度，所以共有 10+10+10=30 个长方形。'
        }
      ],
      review: [
        {question:'选定一个方格长方形后，哪四条线决定了它？',answer:'一条上边界、一条下边界、一条左边界和一条右边界。'},
        {question:'为什么1行3列时，数长方形和数竖边界间的线段用同一种分组？',answer:'固定最左边界，再只选它右边的边界；每个左右边界组合只出现一次。'},
        {question:'2行2列为什么不只是4个小长方形？',answer:'还要把跨两格、跨两行和整个大方格的长方形按高度与宽度分类数进去。'}
      ]
    }
  }
);
