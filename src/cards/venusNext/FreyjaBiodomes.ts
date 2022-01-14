import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Resources} from '../../common/Resources';
import {ResourceType} from '../../ResourceType';
import {SelectCard} from '../../inputs/SelectCard';
import {ICard} from '../ICard';
import {CardName} from '../../CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';

export class FreyjaBiodomes extends Card {
  constructor() {
    super({
      name: CardName.FREYJA_BIODOMES,
      cardType: CardType.AUTOMATED,
      tags: [Tags.PLANT, Tags.VENUS],
      cost: 14,

      requirements: CardRequirements.builder((b) => b.venus(10)),
      victoryPoints: 2,

      metadata: {
        cardNumber: '227',
        renderData: CardRenderer.builder((b) => {
          b.microbes(2, {secondaryTag: Tags.VENUS}).or().animals(2, {secondaryTag: Tags.VENUS}).br;
          b.production((pb) => pb.minus().energy(1).nbsp.plus().megacredits(2));
        }),
        description: {
          text: 'Requires 10% on the Venus track. Add 2 Microbes or 2 Animals to another Venus card. Production: energy -1, M€ +2.',
          align: 'left',
        },
      },
    });
  };
  public canPlay(player: Player): boolean {
    return player.getProduction(Resources.ENERGY) >= 1;
  }
  public getResCards(player: Player): ICard[] {
    let resourceCards = player.getResourceCards(ResourceType.ANIMAL);
    resourceCards = resourceCards.concat(player.getResourceCards(ResourceType.MICROBE));
    return resourceCards.filter((card) => card.tags.includes(Tags.VENUS));
  }

  public play(player: Player) {
    const cards = this.getResCards(player);

    if (cards.length > 1) {
      return new SelectCard(
        'Select card to add 2 resources',
        'Add resources',
        cards,
        (foundCards: Array<ICard>) => {
          player.addResourceTo(foundCards[0], {qty: 2, log: true});
          player.addProduction(Resources.ENERGY, -1);
          player.addProduction(Resources.MEGACREDITS, 2);
          return undefined;
        },
      );
    }

    if (cards.length === 1) {
      player.addResourceTo(cards[0], {qty: 2, log: true});
    }

    player.addProduction(Resources.ENERGY, -1);
    player.addProduction(Resources.MEGACREDITS, 2);
    return undefined;
  }
}
