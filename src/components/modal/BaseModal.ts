import EventComponent from "../abstract/EventComponent";
import { HTMLTemplate, TargetId } from "../../types/common";
import { $ } from "../../utils/dom";

interface BaseModalProps {
  targetId: TargetId;
}

export default abstract class BaseModal extends EventComponent {
  private $modal: HTMLElement | null;

  constructor({ targetId }: BaseModalProps) {
    super({ targetId });
    this.$modal = $<HTMLElement>(this.targetId);
  }

  protected getTemplate(): HTMLTemplate {
    return `
      <div id="modal-backdrop" class="modal-backdrop"></div>
      <div class="modal-container">
          ${this.getModalContent()}
      </div>
    `;
  }

  protected abstract getModalContent(): HTMLTemplate;

  protected setEvent(): void {
    $<HTMLElement>("modal-backdrop")?.addEventListener(
      "click",
      this.closeModal
    );

    window.addEventListener("keydown", this.handleKeyDown);
  }

  protected closeModal = (): void => {
    if (this.$modal && this.$modal.classList.contains("modal-open")) {
      this.$modal.innerHTML = "";
      document.body.classList.remove("no-scroll");
      this.$modal.classList.remove("modal-open");
    }
  };

  private handleKeyDown = (event: KeyboardEvent): void => {
    if (event.key === "Escape") {
      this.closeModal();
    }
  };
}
